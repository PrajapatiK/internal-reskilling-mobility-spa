const apiClient = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<Response> => {
    const response = await fetch(
        `/api${endpoint}`,
        {
            ...options,
            headers: {
                Accept: 'application/json',
                ...options.headers,
            },
        }
    )

    if (!response.ok) {
        throw new Error(
            `API request failed: ${response.status}`
        )
    }

    return response
}

export default apiClient