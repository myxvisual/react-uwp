export default function addWarning(warning?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originFunc = descriptor.value;

    descriptor.value = function() {
      console.warn(`Calling "${name}" with ${arguments}`);
      return originFunc.apply(target, arguments);
    };
    return descriptor;
  };
}
