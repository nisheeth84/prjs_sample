import { useEffect, useState } from 'react';

const classCheckbox: string[] = ['item', 'smooth'];
const classDatePicker: string[] = ['DayPicker-Day'];
const classRemoveProduct: string[] = ['fa', 'fa-times'];
const classImageProductSet: string[] = ['image-product-productset'];
const classClose: string[] = ['close'];
const classPulldown: string[] = ['select-text'];
const classUpload: string[] = ['updload'];
const classInputBusinessCard: string[] = ['input-normal'];
const classDelete: string[] = ['delete'];
const checkClasses = [
  classCheckbox,
  classDatePicker,
  classRemoveProduct,
  classImageProductSet,
  classClose,
  classPulldown,
  classUpload,
  classInputBusinessCard,
  classDelete
];

const useDetectFormChange = (
  formId: string,
  deps?: any[],
  addCheckClass: string[][] = []
): [boolean, (boolean) => any] => {
  const [isChanged, setIsChanged] = useState<boolean>(false);

  const detectChangeInput = event => {
    setTimeout(() => setIsChanged(true), 100);
  };

  const detectClickItem = event => {
    const getClass: string = event.target.className;
    const checkChange = [...checkClasses, ...addCheckClass].some((_classes: string[]) => {
      return _classes.every(_class => getClass.includes(_class));
    });

    if (checkChange) {
      setTimeout(() => setIsChanged(true), 100);
    }
  };

  useEffect(() => {
    const formInput = document.getElementById(formId);
    if (formInput) {
      formInput.addEventListener('input', detectChangeInput);
      formInput.addEventListener('mousedown', detectClickItem);
    }
    return () => {
      if (formInput) {
        formInput.removeEventListener('input', detectChangeInput);
        formInput.removeEventListener('mousedown', detectClickItem);
      }
    };
  }, deps || []);

  return [isChanged, setIsChanged];
};

export { useDetectFormChange };
