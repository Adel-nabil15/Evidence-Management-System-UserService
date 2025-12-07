import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";


// class validator
@ValidatorConstraint({ name: "Match", async: false })
export class MatchP_c implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {

        return value === args.object[args.constraints[0]]
    }

    defaultMessage(args?: ValidationArguments): string {
        return (`${args?.property} is not match with ${args?.constraints[0]}`)
    }
}
// custom decorator
export function IsMatch(constraints?: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints,
            validator: MatchP_c,
        });
    };
}