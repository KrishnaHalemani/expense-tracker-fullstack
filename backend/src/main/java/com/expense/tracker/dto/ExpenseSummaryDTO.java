package com.expense.tracker.dto;

import java.util.Map;
public class ExpenseSummaryDTO {
    private double total;
    private Map<String, Double> categorySummary;

    public ExpenseSummaryDTO(double total, Map<String, Double> categorySummary) {
        this.total = total;
        this.categorySummary = categorySummary;
    }
    public double getTotal() {
        return total;
    }
    public Map<String, Double> getCategorySummary() {
        return categorySummary;
    }
}
