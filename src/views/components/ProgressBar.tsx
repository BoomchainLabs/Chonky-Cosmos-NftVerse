import { Box } from "@0xsequence/design-system";

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar = ({ percentage }: ProgressBarProps) => {
  return (
    <Box
      borderRadius="lg"
      overflow="hidden"
      height="5"
      style={{ width: "25rem", backgroundColor: "#e0e0e0", border: "none" }}
    >
      <Box
        height="full"
        borderRightRadius="lg"
        style={{
          width: `${percentage}%`,
          backgroundColor: "#007bff",
          transition: "width 0.5s ease-in-out",
        }}
      ></Box>
    </Box>
  );
};

export default ProgressBar;
