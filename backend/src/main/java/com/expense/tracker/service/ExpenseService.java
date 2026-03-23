package com.expense.tracker.service;

import com.expense.tracker.entity.Expense;
import com.expense.tracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import com.expense.tracker.dto.ExpenseSummaryDTO;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository){
        this.repository = repository;

    }
    public Expense addExpense(Expense expense) {
        return repository.save(expense);
    }

    public List<Expense> getAllExpenses(){
        return repository.findAll();
    }

    public void deleteExpense(Long id){
        repository.deleteById(id);
    }
    public ExpenseSummaryDTO getSummary(){

        List<Object[]> results = repository.getCategorySummary();
        Map<String, Double> categoryMap = new HashMap<>();
        double total = 0;

        for(Object[] row : results){
            String category = (String) row[0];
            Double amount = (Double) row[1];

            categoryMap.put(category, amount);
            total += amount;
        }
        return new ExpenseSummaryDTO(total, categoryMap);
    }
}
