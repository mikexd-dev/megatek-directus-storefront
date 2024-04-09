import PaddingContainer from "@/components/layout/padding-container";
import Link from "next/link";

export default function NotFound() {
  return (
    <PaddingContainer>
      <h1>Not found – 404!</h1>
      <div>
        <a href="https://megatek.org">Go back to Home</a>
      </div>
    </PaddingContainer>
  );
}
