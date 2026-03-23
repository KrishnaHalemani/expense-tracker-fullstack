import { useEffect, useState } from "react";
import "./App.css";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import toast, { Toaster } from "react-hot-toast";

function App() {

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("");

  const COLORS = ["#3b82f6","#22c55e","#f59e0b","#ef4444","#a855f7"];

  // FETCH
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/expenses");
      const data = await res.json();
      setExpenses(data);
    } catch {
      toast.error("Failed to load expenses");
    }
    setLoading(false);
  };

  // ADD
  const addExpense = async () => {
    try {
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

      toast.success("Expense Added");
      resetForm();
      fetchExpenses();

    } catch {
      toast.error("Add Failed");
    }
  };

  // DELETE
  const deleteExpense = async(id)=>{
    await fetch(`http://localhost:8080/expenses/${id}`,{
      method:"DELETE"
    });
    toast.success("Deleted");
    fetchExpenses();
  };

  // EDIT
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

    toast.success("Updated");
    setShowModal(false);
    resetForm();
    fetchExpenses();
  };

  const resetForm = ()=>{
    setTitle("");
    setAmount("");
    setCategory("Food");
    setDate("");
    setEditId(null);
  };

  useEffect(()=>{
    fetchExpenses();
  },[]);

  // FILTER + SEARCH
  let filtered = expenses
    .filter(e =>
      selectedMonth ? e.date.startsWith(selectedMonth) : true
    )
    .filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase())
    );

  // SORT
  if(sortType==="amount")
    filtered.sort((a,b)=>b.amount-a.amount);

  if(sortType==="date")
    filtered.sort((a,b)=> new Date(b.date)-new Date(a.date));

  // SUMMARY
  const categoryMap = {};
  filtered.forEach(e=>{
    categoryMap[e.category]=(categoryMap[e.category]||0)+e.amount;
  });

  const chartData = Object.keys(categoryMap).map(cat=>({
    name:cat,
    value:categoryMap[cat]
  }));

  const monthlyMap = {};
  expenses.forEach(e=>{
    const m=e.date.substring(0,7);
    monthlyMap[m]=(monthlyMap[m]||0)+e.amount;
  });

  const barData = Object.keys(monthlyMap).map(m=>({
    month:m,
    total:monthlyMap[m]
  }));

  const total = filtered.reduce((s,e)=>s+e.amount,0);

  return (
    <>
      <Toaster position="top-right"/>

      <div className="container">

        <h1>Expense Dashboard</h1>

        {/* FILTER PANEL */}
        <div className="filter-panel">
          <input
            placeholder="Search title..."
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />

          <select onChange={e=>setSortType(e.target.value)}>
            <option value="">Sort</option>
            <option value="amount">Amount</option>
            <option value="date">Date</option>
          </select>

          <select
            value={selectedMonth}
            onChange={e=>setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            <option value="2026-01">Jan</option>
            <option value="2026-02">Feb</option>
            <option value="2026-03">Mar</option>
            <option value="2026-04">Apr</option>
          </select>
        </div>

        {/* SUMMARY */}
        <div className="summary-card">
          <h2>₹{total}</h2>
          <p>Total Expense</p>
        </div>

        {/* PIE */}
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

        {/* BAR */}
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

        {/* TABLE */}
        <div className="full-width">

          {loading && <p className="loading">Loading...</p>}

          {!loading && filtered.length===0 && (
            <p className="empty">No expenses found</p>
          )}

          {!loading && filtered.length>0 && (
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
                {filtered.map(exp=>(
                  <tr key={exp.id}>
                    <td>{exp.title}</td>
                    <td>₹{exp.amount}</td>
                    <td>{exp.category}</td>
                    <td>{exp.date}</td>
                    <td>
                      <button onClick={()=>editExpense(exp)}>Edit</button>
                      <button
                        className="delete-btn"
                        onClick={()=>deleteExpense(exp.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

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
    </>
  );
}

export default App;