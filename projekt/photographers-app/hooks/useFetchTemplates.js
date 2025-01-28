import { useState, useEffect } from "react";
import { defaultTemplates } from "../lib/templates";

function useFetchTemplates(loggedInUserId) {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    if (!loggedInUserId) return;

    const fetchTemplates = async () => {
      try {
        const response = await fetch(`/api/templates?userId=${loggedInUserId}`);
        const customTemplates = await response.json();

        const combinedTemplates = [
          ...Object.keys(defaultTemplates).map((key) => ({
            name: key,
            tasks: defaultTemplates[key].tasks.map((text) => ({ text })),
            equipment: defaultTemplates[key].equipment.map((item) => ({ name: item })),
            isDefault: true,
          })),
          ...customTemplates,
        ];

        setTemplates(combinedTemplates);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      }
    };

    fetchTemplates();
  }, [loggedInUserId]);

  return templates;
}

export default useFetchTemplates;
