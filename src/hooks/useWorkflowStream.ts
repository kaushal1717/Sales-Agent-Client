import { useState, useCallback, useRef } from "react";

interface WorkflowParams {
  city: string;
  business_type?: string;
  max_results?: number;
  search_radius?: number;
  enable_sdr?: boolean;
}

interface WorkflowStep {
  step: string;
  message: string;
  timestamp: string;
  status: string;
  session_id?: string;
  progress?: number;
}

interface WorkflowResults {
  session_id: string;
  city: string;
  business_type: string;
  max_results: number;
  search_radius: number;
  start_time: string;
  leads_finder_results?: any;
  [key: string]: any;
}

export function useWorkflowStream() {
  const [status, setStatus] = useState<
    "idle" | "running" | "completed" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [streamSteps, setStreamSteps] = useState<WorkflowStep[]>([]);
  const [results, setResults] = useState<WorkflowResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamingMessage, setStreamingMessage] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);

  const startWorkflow = useCallback(
    async (params: WorkflowParams) => {
      // Reset state
      setStatus("running");
      setProgress(0);
      setError(null);
      setResults(null);
      setCurrentStep("");
      setSessionId("");
      setStreamSteps([]);
      setStreamingMessage("Starting workflow...");

      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/workflow/main-stream`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              city: params.city,
              business_type: params.business_type || "restaurants",
              max_results: params.max_results || 3,
              search_radius: params.search_radius || 5000,
              enable_sdr: params.enable_sdr !== false,
            }),
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Response body is not readable");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("Stream complete");
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                console.log("Received event:", data);

                // Extract session ID
                if (data.session_id) {
                  setSessionId(data.session_id);
                }

                // Update current step
                if (data.step) {
                  setCurrentStep(data.step);
                }

                // Update message
                if (data.message) {
                  setStreamingMessage(data.message);
                }

                // Update progress
                if (data.progress !== undefined) {
                  setProgress(data.progress);
                }

                // Add to step history
                if (data.step && data.message) {
                  setStreamSteps((prev) => [
                    ...prev,
                    {
                      step: data.step,
                      message: data.message,
                      timestamp: data.timestamp || new Date().toISOString(),
                      status: data.status || "running",
                      session_id: data.session_id,
                      progress: data.progress,
                    },
                  ]);
                }

                // Handle step-specific logic
                switch (data.step) {
                  case "initializing":
                    setProgress(
                      data.progress !== undefined ? data.progress : 0
                    );
                    break;
                  case "lead_discovery":
                    setProgress(
                      data.progress !== undefined ? data.progress : 20
                    );
                    break;
                  case "wait_for_upload":
                    setProgress(
                      data.progress !== undefined ? data.progress : 40
                    );
                    break;
                  case "retrieve_leads":
                    setProgress(
                      data.progress !== undefined ? data.progress : 60
                    );
                    break;
                  case "sdr_processing":
                    setProgress(
                      data.progress !== undefined ? data.progress : 80
                    );
                    break;
                  case "workflow_complete":
                    setProgress(100);
                    setStatus("completed");
                    setStreamingMessage("Workflow completed successfully!");
                    if (data.data) {
                      setResults(data.data);
                    }
                    return;
                  case "workflow_error":
                    setStatus("error");
                    setError(
                      data.message ||
                        "An error occurred during workflow execution"
                    );
                    setStreamingMessage("Workflow failed");
                    return;
                }
              } catch (e) {
                console.error("Error parsing event:", e, "Line:", line);
              }
            }
          }
        }

        // If we exit the loop without explicit completion, mark as completed
        if (status === "running") {
          setStatus("completed");
          setProgress(100);
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Request aborted");
          setStatus("idle");
          setStreamingMessage("Workflow cancelled");
        } else {
          console.error("Workflow error:", error);
          setStatus("error");
          setError(error.message || "An unexpected error occurred");
          setStreamingMessage("Error occurred");
        }
      }
    },
    [status]
  );

  const cancelWorkflow = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus("idle");
    setStreamingMessage("Workflow cancelled");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setCurrentStep("");
    setSessionId("");
    setStreamSteps([]);
    setResults(null);
    setError(null);
    setStreamingMessage("");
  }, []);

  return {
    status,
    progress,
    currentStep,
    sessionId,
    streamSteps,
    results,
    error,
    streamingMessage,
    startWorkflow,
    cancelWorkflow,
    reset,
  };
}
