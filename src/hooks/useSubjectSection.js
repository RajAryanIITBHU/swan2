import { useCallback } from "react";
import { produce } from "immer";

export const useSubjectSection = (subject, sectionIndex, data, setData) => {
  const updateSection = useCallback(
    (updater) => {
      setData(
        produce((draft) => {
          updater(draft[subject][sectionIndex]);
        })
      );
    },
    [subject, sectionIndex, setData]
  );

  const getCurrentQuestion = useCallback(() => {
    return data[subject][sectionIndex].questions.find((q) => !q.added);
  }, [data, subject, sectionIndex]);

  const updateCurrentQuestion = useCallback(
    (updater) => {
      updateSection((section) => {
        const question = section.questions.find((q) => !q.added);
        if (question) {
          updater(question);
        }
      });
    },
    [updateSection]
  );

  return {
    updateSection,
    getCurrentQuestion,
    updateCurrentQuestion,
  };
};
