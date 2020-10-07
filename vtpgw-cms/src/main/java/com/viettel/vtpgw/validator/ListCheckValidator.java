package com.viettel.vtpgw.validator;

import com.viettel.vtpgw.shared.utils.IpRegex;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

public class ListCheckValidator implements ConstraintValidator<ListCheck, Object> {

    protected ListCheck constraintAnnotation;

    @Override
    public void initialize(ListCheck constraintAnnotation) {
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
        if (value instanceof List) {
            List<String> typedField = (List) value;
            if (constraintAnnotation.ip().equals("ip")) {
                return typedField.stream()
                        .anyMatch(ip -> IpRegex.isValid(ip));
            }else {
                return typedField.stream()
                        .anyMatch(method -> Arrays.stream(constraintAnnotation.method())
                                .anyMatch(v -> v.equalsIgnoreCase(method)));
            }

        }
        return false;
    }
}
