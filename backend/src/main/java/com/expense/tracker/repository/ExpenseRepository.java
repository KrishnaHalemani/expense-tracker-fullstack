package com.expense.tracker.repository;
import org.springframework.data.jpa.repository.Query;
import com.expense.tracker.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long>{
    @Query("SELECT e.category, SUM(e.amount) FROM Expense e GROUP BY e.category")
    List<Object[]> getCategorySummary();
}
