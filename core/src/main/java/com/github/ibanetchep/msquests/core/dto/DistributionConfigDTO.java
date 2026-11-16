package com.github.ibanetchep.msquests.core.dto;

import java.util.List;

public record DistributionConfigDTO(
        String strategy,
        Integer amount,
        List<String> triggers,
        String position
) {
    public DistributionConfigDTO(String strategy, Integer amount, List<String> triggers) {
        this(strategy, amount, triggers, null);
    }
}
