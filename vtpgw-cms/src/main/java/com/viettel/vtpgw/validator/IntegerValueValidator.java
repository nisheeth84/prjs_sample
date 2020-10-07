package com.viettel.vtpgw.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.Objects;

public class IntegerValueValidator implements ConstraintValidator<IntegerValue, Object> {

    protected IntegerValue constraintAnnotation;

    @Override
    public void initialize(IntegerValue constraintAnnotation) {
        this.constraintAnnotation = constraintAnnotation;
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        boolean result = validateField(value);
        if (!result) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                    constraintAnnotation.message()
            )
                    .addConstraintViolation();
        }
        return result;
    }

    private boolean validateField(Object value) {
        if (Objects.isNull(value)) {
            return true;
        }
        if (value instanceof Integer) {
            Integer typedField = (Integer) value;
            return Arrays.stream(constraintAnnotation.numbers())
                    .anyMatch(v -> Objects.equals(v, typedField));
        }
        return false;
    }
}
