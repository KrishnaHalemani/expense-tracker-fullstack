import { useEffect, useState } from "react";
import "./App.css";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

function App() {

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");

  const COLORS = ["#3b82f6","#22c55e","#f59e0b","#ef4444","#a855f7"];

  const chartData = summary
    ? Object.keys(summary.categorySummary).map(cat => ({
        name: cat,
        value: summary.categorySummary[cat]
      }))
    : [];

  const monthlyData = expenses.reduce((acc, exp) => {
    const m = exp.date.substring(0,7);
    acc[m] = (acc[m] || 0) + exp.amount;
    return acc;
  }, {});

  const barData = Object.keys(monthlyData).map(m => ({
    month: m,
    total: monthlyData[m]
  }));

  const filteredExpenses = selectedMonth
    ? expenses.filter(e => e.date.startsWith(selectedMonth))
    : expenses;

  const fetchExpenses = async () => {
    const res = await fetch("http://localhost:8080/expenses");
    setExpenses(await res.json());
  };

  const fetchSummary = async () => {
    const res = await fetch("http://localhost:8080/expenses/summary");
    setSummary(await res.json());
  };

  const addExpense = async () => {
    await fetch("http://localhost:8080/expenses", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        title,
        amount:Number(amount),
        category,
        date
      })
    });

    setTitle("");
    setAmount("");
    setDate("");

    fetchExpenses();
    fetchSummary();
  };

  const deleteExpense = async(id)=>{
    await fetch(`http://localhost:8080/expenses/${id}`,{
      method:"DELETE"
    });
    fetchExpenses();
    fetchSummary();
  };

  const editExpense = (exp)=>{
    setTitle(exp.title);
    setAmount(exp.amount);
    setCategory(exp.category);
    setDate(exp.date);
    setEditId(exp.id);
    setShowModal(true);
  };

  const updateExpense = async ()=>{
    await fetch(`http://localhost:8080/expenses/${editId}`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        title,
        amount:Number(amount),
        category,
        date
      })
    });

    setShowModal(false);
    setEditId(null);
    setTitle("");
    setAmount("");
    setDate("");

    fetchExpenses();
    fetchSummary();
  };

  useEffect(()=>{
    fetchExpenses();
    fetchSummary();
  },[]);

  return (
    <div className="container">

      <h1>Expense Dashboard</h1>

      <div className="dashboard">

        {/* FORM */}
        <div className="form-card">
          <h3>Add Expense</h3>

          <input value={title} placeholder="Title"
            onChange={e=>setTitle(e.target.value)} />

          <input value={amount} type="number" placeholder="Amount"
            onChange={e=>setAmount(e.target.value)} />

          <select value={category}
            onChange={e=>setCategory(e.target.value)}>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>General</option>
          </select>

          <input type="date" value={date}
            onChange={e=>setDate(e.target.value)} />

          <button onClick={addExpense}>Add Expense</button>
        </div>

        {/* SUMMARY */}
        {summary && (
          <div className="summary-card">
            <h2 className="total">₹{summary.total}</h2>
            <p className="total-label">Total Expense</p>

            <div className="category-grid">
              {Object.keys(summary.categorySummary).map(cat=>(
                <div className="category-box" key={cat}>
                  <span>{cat}</span>
                  <span>₹{summary.categorySummary[cat]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PIE CHART */}
        <div className="summary-card full-width">
          <h2>Category Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="value" label>
                {chartData.map((e,i)=>(
                  <Cell key={i} fill={COLORS[i%COLORS.length]} />
                ))}
              </Pie>
              <Tooltip/>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="summary-card full-width">
          <h2>Monthly Expense</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="total" fill="#3b82f6"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* FILTER */}
        <div className="full-width filter">
          <input type="month"
            onChange={e=>setSelectedMonth(e.target.value)} />
        </div>

        {/* TABLE */}
        <div className="full-width">
          <table>
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
              {filteredExpenses.map(exp=>(
                <tr key={exp.id}>
                  <td>{exp.title}</td>
                  <td>₹{exp.amount}</td>
                  <td>{exp.category}</td>
                  <td>{exp.date}</td>
                  <td>
                    <button onClick={()=>editExpense(exp)}>Edit</button>
                    <button className="delete-btn"
                      onClick={()=>deleteExpense(exp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Expense</h2>

            <input value={title} onChange={e=>setTitle(e.target.value)} />
            <input type="number" value={amount}
              onChange={e=>setAmount(e.target.value)} />

            <select value={category}
              onChange={e=>setCategory(e.target.value)}>
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>General</option>
            </select>

            <input type="date" value={date}
              onChange={e=>setDate(e.target.value)} />

            <button onClick={updateExpense}>Update</button>
            <button onClick={()=>setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;