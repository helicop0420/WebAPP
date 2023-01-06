import Highlight from "./Highlight";
interface HighlightProps {
  highlights:
    | {
        title: string | null;
        value: string | null;
      }[]
    | null;
}
const AllHighlights = ({ highlights }: HighlightProps) => {
  return (
    <>
      {highlights && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 justify-content-center">
            <Highlight
              value={highlights[0].value ?? ""}
              title={highlights[0].title ?? ""}
              class="text-center w-full content-center border-r border-b border-gray-200 p-2 py-4"
            />
            <Highlight
              value={highlights[1].value ?? ""}
              title={highlights[1].title ?? ""}
              class="text-center w-full content-center border-l border-b border-gray-200 p-2 py-4"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 justify-content-center min-h-30">
            <Highlight
              value={highlights[2].value ?? ""}
              title={highlights[2].title ?? ""}
              class="text-center w-full content-center border-r border-t border-gray-200 p-2 py-4"
            />
            <Highlight
              value={highlights[3].value ?? ""}
              title={highlights[3].title ?? ""}
              class="text-center w-full content-center border-l border-t border-gray-200 p-2 py-4"
            />
          </div>
        </>
      )}
    </>
  );
};

export default AllHighlights;
