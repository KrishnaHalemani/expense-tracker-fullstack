import { useState } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");


  const addExpense = async () => {
    await fetch("http://localhost:8080/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        amount: amount,
        category,
        date
      })
    });

    alert("Expense Added");
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Expense Tracker</h1>

      <input
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      <select onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Other</option>
          </select>

          <br /><br />

          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
          />

          <br /><br />

      <button onClick={addExpense}>Add Expense</button>
    </div>
  );
}

export default App;