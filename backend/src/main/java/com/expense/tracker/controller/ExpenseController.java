package com.expense.tracker.controller;

import com.expense.tracker.dto.ExpenseSummaryDTO;
import com.expense.tracker.entity.Expense;
import com.expense.tracker.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service){
        this.service = service;

    }
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense){
        return service.addExpense(expense);
    }

    @GetMapping
    public List<Expense> getAllExpenses(){
        return service.getAllExpenses();
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id){
        service.deleteExpense(id);
    }
    @GetMapping("/summary")
    public ExpenseSummaryDTO getSummary(){
        return service.getSummary();
    }
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense){
        return service.updateExpense(id, expense);
    }
}
