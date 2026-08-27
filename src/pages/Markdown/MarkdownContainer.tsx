import MarkdownContent from '../../components/MarkdownContent'

const MarkdownContainer = () => {
  return (
        <main className="app-shell">
      <MarkdownContent content={`
        ### Analysis Summary
| Criteria | Matches | Details |
| :--- | :--- | :--- |
| **Workload (20–25 hrs)** | 2 Candidates | **EMP-7EYIDM** (20 hrs), **EMP-CE51PY** (23 hrs) |
| **MERN Skills (MongoDB, Node.js, React/Next.js/Redux)** | 0 Candidates in range | The 2 candidates in workload range lack core MERN skills (Missing Node.js, React/Next.js, MongoDB). |
| **Best Skill Match (MERN)** | 3 Candidates (Outside Range) | **EMP-2EYKM3** (18 hrs), **EMP-3PEZI6** (19 hrs), **EMP-BXL03C** (17 hrs) have 2+ core MERN skills but are slightly under the 20-hour threshold. |

---

### Recommended Candidates (Best Compromise)
The table below lists the **top 3 candidates with the strongest MERN Stack skill alignment**, whose workloads are closest to your target range (17–19 hours). These are the most viable options for immediate upskilling or workload adjustment.

| employee_id | name | current_skillset | workload_hours | MERN Match Score | Gap Analysis |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **EMP-2EYKM3** | **Anjali Mehta** | **TypeScript, Redux, Redis, MongoDB** | **18** | **High (3/4 Core)** | **Missing:** Node.js / Express.js. **Strengths:** MongoDB, Redux (State Mgmt), TypeScript (React/Node standard). Workload closest to range. |
| **EMP-3PEZI6** | **Rahul Sharma** | **Redis, MongoDB, Django, Node.js** | **19** | **Medium-High (2/4 Core)** | **Missing:** React / Next.js / Redux (Frontend). **Strengths:** MongoDB, Node.js (Backend solid). 9 yrs exp. Workload almost in range. |
| **EMP-BXL03C** | **Neha Gupta** | **Python, MongoDB, Redis, Node.js** | **17** | **Medium (2/4 Core)** | **Missing:** React / Next.js / Redux (Frontend). **Strengths:** MongoDB, Node.js. 6 yrs exp. Slightly lower workload. |

---

### Candidates Within Workload Range (20–25 hrs) — *Skill Mismatch*
*Provided for completeness; **not recommended** for MERN role without significant reskilling.*

| employee_id | name | current_skillset | workload_hours | MERN Match Score | Reason for Exclusion |
| :--- | :--- | :--- | :--- | :--- | :--- |
| EMP-7EYIDM | Rohit Kumar | FastAPI, MongoDB, PostgreSQL, Django | 20 | Low (1/4) | **Python/Django Stack.** Only MongoDB overlaps. No Node.js, No Frontend (React/Next). |
| EMP-CE51PY | Anjali Mehta | LLMs, RAG, Redis, PostgreSQL | 23 | None (0/4) | **AI/ML Focus.** No MongoDB, No Node.js, No React/Next/Redux. |

### Recommendation
1.  **Prioritize EMP-2EYKM3 (Anjali Mehta):** Strongest frontend/backend overlap (MongoDB, Redux, TypeScript). Only missing Node.js/Express. Workload (18h) is closest to target.
2.  **Consider Workload Adjustment:** Since top skilled candidates are at 17–19 hours, discuss increasing allocation to 20+ hours for the right candidate.
3.  **EMP-X2Z9XG (Priya Singh)** has excellent MERN skills (MongoDB, Next.js, TypeScript) but is at **40 hours** (Full capacity). Check if she can offload 15-20 hours.
        `} />
    </main>
  )
}

export default MarkdownContainer