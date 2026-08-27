import {
	useEffect,
	useRef,
	useState,
} from 'react'
import {
	useLocation,
	useNavigate,
} from 'react-router'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import apiClient from '../../services/api/apiClient'
import '../../components/Markdown/MarkdownContent.css'

interface Thread {
	thread_id: string
	last_updated: string
}

interface Message {
	role: string
	content: string
}

interface LocationState {
	username?: string
	threads?: Thread[]
}

const apiHeaders: Record<string, string> = {
	'ngrok-skip-browser-warning': '1',
}

function formatThreadId(username: string): string {
	const now = new Date()

	const day = now.toLocaleDateString('en-US', {
		weekday: 'short',
	})

	const date = now.getDate()

	const month = now.toLocaleDateString('en-US', {
		month: 'short',
	})

	const year = now.getFullYear()

	return `${day}-${date}-${month}-${year}-${username}`
}

const ChatPage = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const state =
		location.state as LocationState | null

	const username = state?.username

	const initialThreads =
		state?.threads ?? []

	// ==================================================
	// State
	// ==================================================

	const [threads, setThreads] =
		useState<Thread[]>(initialThreads)

	const [selectedThread, setSelectedThread] =
		useState<string | null>(
			initialThreads.length > 0
				? initialThreads[0].thread_id
				: null
		)

	const [messages, setMessages] =
		useState<Message[]>([])

	const [input, setInput] =
		useState('')

	const [loadingThreads, setLoadingThreads] =
		useState(false)

	const [loadingMessages, setLoadingMessages] =
		useState(false)

	const [sending, setSending] =
		useState(false)

	// ==================================================
	// Refs
	// ==================================================

	const messagesEndRef =
		useRef<HTMLDivElement | null>(null)

	const abortControllerRef =
		useRef<AbortController | null>(null)

	// ==================================================
	// Scroll to bottom
	// ==================================================

	const scrollToBottom = (
		smooth = true
	) => {
		requestAnimationFrame(() => {
			messagesEndRef.current?.scrollIntoView({
				behavior: smooth
					? 'smooth'
					: 'auto',
				block: 'end',
			})
		})
	}

	// ==================================================
	// Fetch Threads
	// ==================================================

	useEffect(() => {
		if (!username) {
			navigate('/')
			return
		}

		// Threads were already supplied through
		// React Router state.
		if (initialThreads.length > 0) {
			return
		}

		const controller =
			new AbortController()

		const loadThreads = async () => {
			try {
				setLoadingThreads(true)

				const response = await apiClient(
					`/threads?user_id=${encodeURIComponent(username)}`,
					{
						method: 'GET',
						headers: apiHeaders,
						signal: controller.signal,
					}
				)

				const data: Thread[] =
					await response.json()

				if (
					Array.isArray(data) &&
					data.length > 0
				) {
					setThreads(data)
					setSelectedThread(
						data[0].thread_id
					)
				} else {
					const newId =
						formatThreadId(username)

					const newThread: Thread = {
						thread_id: newId,
						last_updated:
							new Date().toISOString(),
					}

					setThreads([newThread])
					setSelectedThread(newId)
				}
			} catch (error) {
				if (
					error instanceof
					DOMException &&
					error.name === 'AbortError'
				) {
					return
				}

				console.error(
					'Failed to fetch threads:',
					error
				)

				const newId =
					formatThreadId(username)

				const newThread: Thread = {
					thread_id: newId,
					last_updated:
						new Date().toISOString(),
				}

				setThreads([newThread])
				setSelectedThread(newId)
			} finally {
				if (!controller.signal.aborted) {
					setLoadingThreads(false)
				}
			}
		}

		loadThreads()

		return () => {
			controller.abort()
		}
	}, [
		username,
		navigate,
		initialThreads.length,
	])

	// ==================================================
	// Fetch Messages
	// ==================================================

	useEffect(() => {
		if (!selectedThread) {
			return
		}

		const controller =
			new AbortController()

		const loadMessages = async () => {
			try {
				setLoadingMessages(true)

				const response = await apiClient(
					`/threads/${encodeURIComponent(selectedThread)}/messages`,
					{
						method: 'GET',
						headers: apiHeaders,
						signal: controller.signal,
					}
				)

				const payload =
					await response.json()

				let data: Message[] = []

				if (Array.isArray(payload)) {
					data = payload
				} else if (
					Array.isArray(
						payload?.messages
					)
				) {
					data = payload.messages
				}

				setMessages(data)

				// Scroll after messages are rendered.
				requestAnimationFrame(() => {
					setTimeout(() => {
						if (
							!controller.signal
								.aborted
						) {
							messagesEndRef.current?.scrollIntoView(
								{
									behavior:
										'auto',
									block: 'end',
								}
							)
						}
					}, 0)
				})
			} catch (error) {
				if (
					error instanceof
					DOMException &&
					error.name === 'AbortError'
				) {
					return
				}

				console.error(
					'Failed to fetch messages:',
					error
				)

				setMessages([])
			} finally {
				if (!controller.signal.aborted) {
					setLoadingMessages(false)
				}
			}
		}

		loadMessages()

		return () => {
			controller.abort()
		}
	}, [selectedThread])

	// ==================================================
	// Select Thread
	// ==================================================

	const handleSelectThread = (
		threadId: string
	) => {
		if (
			threadId === selectedThread
		) {
			return
		}

		// Cancel an active streaming request.
		abortControllerRef.current?.abort()

		setSending(false)

		setMessages([])

		setSelectedThread(threadId)
	}

	// ==================================================
	// Extract text from stream
	// ==================================================

	const extractStreamText = (
		rawData: string
	): string => {
		if (!rawData) {
			return ''
		}

		const data = rawData.trim()

		if (!data || data === '[DONE]') {
			return ''
		}

		try {
			const parsed =
				JSON.parse(data)

			if (
				typeof parsed === 'string'
			) {
				return parsed
			}

			if (
				typeof parsed?.answer ===
				'string'
			) {
				return parsed.answer
			}

			if (
				typeof parsed?.content ===
				'string'
			) {
				return parsed.content
			}

			if (
				typeof parsed?.token ===
				'string'
			) {
				return parsed.token
			}

			return ''
		} catch {
			return data
		}
	}

	// ==================================================
	// Process SSE buffer
	// ==================================================

	const processStreamBuffer = (
		buffer: string
	): {
		text: string
		remaining: string
	} => {
		const lines =
			buffer.split('\n')

		const hasCompleteLine =
			buffer.endsWith('\n')

		const completeLines =
			hasCompleteLine
				? lines
				: lines.slice(0, -1)

		const remaining =
			hasCompleteLine
				? ''
				: lines[lines.length - 1] ?? ''

		let text = ''

		for (const line of completeLines) {
			const trimmed = line.trim()

			if (
				!trimmed.startsWith('data:')
			) {
				continue
			}

			const data =
				trimmed.replace(
					/^data:\s*/,
					''
				)

			const extracted =
				extractStreamText(data)

			text += extracted
		}

		return {
			text,
			remaining,
		}
	}

	// ==================================================
	// Update Assistant Message
	// ==================================================

	const updateAssistantMessage = (
		content: string
	) => {
		setMessages((previousMessages) => {
			if (
				previousMessages.length ===
				0
			) {
				return previousMessages
			}

			const updatedMessages = [
				...previousMessages,
			]

			const lastIndex =
				updatedMessages.length - 1

			const lastMessage =
				updatedMessages[lastIndex]

			if (
				lastMessage?.role !==
				'assistant'
			) {
				return previousMessages
			}

			updatedMessages[lastIndex] = {
				...lastMessage,
				content,
			}

			return updatedMessages
		})

		scrollToBottom()
	}

	// ==================================================
	// Send Message
	// ==================================================

	const handleSend = async () => {
		const trimmedInput =
			input.trim()

		if (
			!trimmedInput ||
			!selectedThread ||
			!username ||
			sending
		) {
			return
		}

		const currentThread =
			selectedThread

		const currentUsername =
			username

		// Cancel any previous request.
		abortControllerRef.current?.abort()

		const controller =
			new AbortController()

		abortControllerRef.current =
			controller

		// ==================================================
		// Add User + Assistant Messages
		// ==================================================

		setMessages((previousMessages) => [
			...previousMessages,
			{
				role: 'user',
				content: trimmedInput,
			},
			{
				role: 'assistant',
				content: '',
			},
		])

		setInput('')
		setSending(true)

		// Scroll immediately after Send.
		scrollToBottom()

		try {
			const url =
				`/chat?user_id=${encodeURIComponent(
					currentUsername
				)}` +
				`&thread_id=${encodeURIComponent(
					currentThread
				)}` +
				`&query=${encodeURIComponent(
					trimmedInput
				)}`

			console.log(
				'Streaming Chat API:',
				url
			)

			const response =
				await apiClient(url, {
					method: 'POST',
					headers: {
						...apiHeaders,
						'Content-Type':
							'application/json',
					},
					signal:
						controller.signal,
					body: '',
				})

			console.log(
				'Chat response status:',
				response.status
			)

			if (!response.ok) {
				const errorText =
					await response.text()

				console.error(
					'Chat API error:',
					errorText
				)

				throw new Error(
					`Chat API failed: ${response.status}`
				)
			}

			if (!response.body) {
				throw new Error(
					'Streaming response body is empty'
				)
			}

			const reader =
				response.body.getReader()

			const decoder =
				new TextDecoder('utf-8')

			let buffer = ''
			let accumulatedAnswer = ''

			// ==================================================
			// Read Stream
			// ==================================================

			while (true) {
				const {
					done,
					value,
				} = await reader.read()

				if (done) {
					break
				}

				buffer += decoder.decode(
					value,
					{
						stream: true,
					}
				)

				const processed =
					processStreamBuffer(
						buffer
					)

				buffer =
					processed.remaining

				if (!processed.text) {
					continue
				}

				accumulatedAnswer +=
					processed.text

				updateAssistantMessage(
					accumulatedAnswer
				)
			}

			// ==================================================
			// Flush Decoder
			// ==================================================

			buffer += decoder.decode()

			if (buffer) {
				const processed =
					processStreamBuffer(
						`${buffer}\n`
					)

				if (processed.text) {
					accumulatedAnswer +=
						processed.text

					updateAssistantMessage(
						accumulatedAnswer
					)
				}
			}

			// ==================================================
			// Handle plain response
			// ==================================================

			if (
				!accumulatedAnswer &&
				buffer
			) {
				const fallbackText =
					extractStreamText(
						buffer
					)

				if (fallbackText) {
					accumulatedAnswer =
						fallbackText

					updateAssistantMessage(
						accumulatedAnswer
					)
				}
			}

			console.log(
				'Complete answer:',
				accumulatedAnswer
			)

			// Final scroll.
			scrollToBottom()
		} catch (error) {
			if (
				error instanceof
				DOMException &&
				error.name === 'AbortError'
			) {
				return
			}

			console.error(
				'Failed to send message:',
				error
			)

			setMessages((previousMessages) => {
				if (
					previousMessages.length ===
					0
				) {
					return previousMessages
				}

				const updatedMessages = [
					...previousMessages,
				]

				const lastIndex =
					updatedMessages.length - 1

				const lastMessage =
					updatedMessages[lastIndex]

				if (
					lastMessage?.role ===
					'assistant'
				) {
					updatedMessages[
						lastIndex
					] = {
						...lastMessage,
						content:
							'Sorry, something went wrong while processing your request.',
					}
				}

				return updatedMessages
			})

			scrollToBottom()
		} finally {
			if (
				abortControllerRef.current ===
				controller
			) {
				abortControllerRef.current =
					null
			}

			setSending(false)

			scrollToBottom()
		}
	}

	// ==================================================
	// Cleanup
	// ==================================================

	useEffect(() => {
		return () => {
			abortControllerRef.current?.abort()
		}
	}, [])

	// ==================================================
	// Render
	// ==================================================

	return (
		<div className="h-screen flex flex-col bg-gray-100">
			<div className="flex flex-1 overflow-hidden">

				{/* ====================================== */}
				{/* LEFT - THREADS */}
				{/* ====================================== */}

				<aside className="w-64 border-r border-gray-300 bg-white flex flex-col">

					<div className="p-4 border-b border-gray-200">

						<h2 className="text-lg font-semibold text-gray-800">
							Threads
						</h2>

						{username && (
							<p className="text-xs text-gray-500 mt-1 truncate">
								{username}
							</p>
						)}

					</div>

					<div className="flex-1 overflow-y-auto">

						{loadingThreads ? (
							<p className="p-4 text-gray-500 text-sm">
								Loading…
							</p>
						) : threads.length === 0 ? (
							<p className="p-4 text-gray-500 text-sm">
								No threads
							</p>
						) : (
							threads.map(
								(thread) => (
									<button
										type="button"
										key={
											thread.thread_id
										}
										onClick={() =>
											handleSelectThread(
												thread.thread_id
											)
										}
										className={`
                                            w-full
                                            text-left
                                            px-4
                                            py-3
                                            text-sm
                                            border-b
                                            border-gray-100
                                            hover:bg-gray-50
                                            cursor-pointer
                                            ${selectedThread ===
												thread.thread_id
												? 'bg-blue-50 font-medium text-blue-700'
												: 'text-gray-700'
											}
                                        `}
									>
										<div className="truncate">
											{
												thread.thread_id
											}
										</div>

										{thread.last_updated && (
											<div className="text-xs text-gray-400 mt-1">
												{new Date(
													thread.last_updated
												).toLocaleString()}
											</div>
										)}
									</button>
								)
							)
						)}

					</div>

				</aside>

				{/* ====================================== */}
				{/* RIGHT - CHAT */}
				{/* ====================================== */}

				<main className="flex-1 flex flex-col">

					{selectedThread ? (
						<>
							{/* ================================== */}
							{/* HEADER */}
							{/* ================================== */}

							<div className="px-4 py-3 border-b border-gray-200 bg-white">

								<div className="text-sm font-medium text-gray-700">
									{
										selectedThread
									}
								</div>

							</div>

							{/* ================================== */}
							{/* MESSAGES */}
							{/* ================================== */}

							<div className="flex-1 overflow-y-auto p-4 space-y-4">

								{loadingMessages ? (
									<div className="text-gray-400 text-sm">
										Loading messages…
									</div>
								) : messages.length === 0 ? (
									<div className="text-gray-400 text-sm">
										No messages yet.
									</div>
								) : (
									messages.map(
										(
											message,
											index
										) => {
											const isUser =
												message.role ===
												'user' ||
												message.role ===
												'human'

											const isLastMessage =
												index ===
												messages.length -
												1

											return (
												<div
													key={`${selectedThread}-${index}`}
													className={`
                                                        flex
                                                        ${isUser
															? 'justify-end'
															: 'justify-start'
														}
                                                    `}
												>
													<div
														className={`
                                                            max-w-[80%]
                                                            px-4
                                                            py-3
                                                            rounded-2xl
                                                            text-sm
                                                            ${isUser
																? 'bg-blue-600 text-white'
																: 'bg-white text-gray-800 border border-gray-200'
															}
                                                        `}
													>
														{isUser ? (
															<div className="whitespace-pre-wrap">
																{
																	message.content
																}
															</div>
														) : (
															<div className="markdown-content">

																{message.content ? (
																	<ReactMarkdown
																		remarkPlugins={[
																			remarkGfm,
																		]}
																	>
																		{
																			message.content
																		}
																	</ReactMarkdown>
																) : sending &&
																	isLastMessage ? (
																	<div className="flex items-center gap-1">
																		<span className="animate-bounce">
																			●
																		</span>

																		<span
																			className="animate-bounce"
																			style={{
																				animationDelay:
																					'0.15s',
																			}}
																		>
																			●
																		</span>

																		<span
																			className="animate-bounce"
																			style={{
																				animationDelay:
																					'0.3s',
																			}}
																		>
																			●
																		</span>
																	</div>
																) : null}

															</div>
														)}
													</div>
												</div>
											)
										}
									)
								)}

								{/* ================================== */}
								{/* SCROLL TARGET */}
								{/* ================================== */}

								<div
									ref={
										messagesEndRef
									}
								/>

							</div>

							{/* ================================== */}
							{/* INPUT */}
							{/* ================================== */}

							<div className="p-3 border-t border-gray-200 bg-white">

								<div className="flex gap-2">

									<input
										type="text"
										value={input}
										onChange={(event) => {
											setInput(
												event.target.value
											)
										}}
										onKeyDown={(event) => {
											if (
												event.key ===
												'Enter' &&
												!event.shiftKey
											) {
												event.preventDefault()
												void handleSend()
											}
										}}
										placeholder="Message..."
										disabled={sending}
										className="
                                            flex-1
                                            border
                                            border-gray-300
                                            rounded-md
                                            px-3
                                            py-2
                                            text-sm
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-blue-500
                                            disabled:bg-gray-100
                                        "
									/>

									<button
										type="button"
										onClick={() => {
											void handleSend()
										}}
										disabled={
											sending ||
											!input.trim()
										}
										className="
                                            bg-blue-600
                                            text-white
                                            px-5
                                            py-2
                                            rounded-md
                                            hover:bg-blue-700
                                            transition
                                            text-sm
                                            cursor-pointer
                                            disabled:opacity-50
                                            disabled:cursor-not-allowed
                                        "
									>
										{sending
											? 'Sending…'
											: 'Send'}
									</button>

								</div>

							</div>
						</>
					) : (
						<div className="flex-1 flex items-center justify-center text-gray-400">
							Select a thread to view messages
						</div>
					)}

				</main>

			</div>
		</div>
	)
}

export default ChatPage;
