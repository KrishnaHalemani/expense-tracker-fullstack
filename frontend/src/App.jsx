import { useState, useEffect } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState(null);

  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    const res = await fetch("http://localhost:8080/expenses");
    const data = await res.json();
    setExpenses(data);
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const addExpense = async () => {
    await fetch("http://localhost:8080/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        amount,
        category,
        date
      })
    });

    fetchExpenses();
    fetchSummary();
  };
const deleteExpense = async (id) => {
  await fetch(`http://localhost:8080/expenses/${id}`, {
    method: "DELETE"
  });

  fetchExpenses();
  fetchSummary();// reload list
};
const fetchSummary = async () => {
  const res = await fetch("http://localhost:8080/expenses/summary");
  const data = await res.json();
  setSummary(data);
};


  return (
    <div style={{ padding: 30 }}>
      <h1>Expense Tracker</h1>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <br /><br />

      <input
        type="number"
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />
      <br /><br />

      <select onChange={(e) => setCategory(e.target.value)}>
        <option>Select Category</option>
        <option>Food</option>
        <option>Travel</option>
        <option>Shopping</option>
        <option>Other</option>
      </select>

      <br /><br />

      <input type="date" onChange={(e) => setDate(e.target.value)} />

      <br /><br />

      <button onClick={addExpense}>Add Expense</button>

{summary && (
  <div style={{ marginBottom: 20 }}>
    <h2>Total Expense: ₹{summary.total}</h2>

    <h3>Category Summary</h3>
    <ul>
      {Object.keys(summary.categorySummary).map(cat => (
        <li key={cat}>
          {cat}: ₹{summary.categorySummary[cat]}
        </li>
      ))}
    </ul>
  </div>
)}

      <h2>Expense List</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.title}</td>
              <td>{exp.amount}</td>
              <td>{exp.category}</td>
              <td>{exp.date}</td>
              <td>
                <button onClick={() => deleteExpense(exp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;