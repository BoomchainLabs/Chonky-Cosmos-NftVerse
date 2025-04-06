import { SequenceAPIClient } from "@0xsequence/api";
import { useMemo } from "react";

import { useProjectAccessKey } from "./useProjectAccessKey";

export const useAPIClient = () => {
  const projectAccessKey = useProjectAccessKey();

  const clientUrl = "https://api.sequence.app";

  const apiClient = useMemo(() => {
    return new SequenceAPIClient(clientUrl, projectAccessKey);
  }, [projectAccessKey]);

  return apiClient;
};
