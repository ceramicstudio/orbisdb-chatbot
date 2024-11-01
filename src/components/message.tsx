import { formatRelative, formatDistance, differenceInHours } from "date-fns";
import { type PostProps } from "@/utils/types";

export const Message = ({
  profile,
  body,
  created,
  tag,
}: PostProps) => {

  return (
    <div
      className={`flex flex-col relative space-x-1 space-y-1 ${
        tag === "bot" ? "text-right" : "text-left"
      }`}
    >
      <div
        className={`flex relative space-x-1 ${
          tag === "bot" ? "flex-row-reverse space-x-reverse" : "flex-row"
        }`}
      >
        {profile.username && profile.emoji && (
          <div className="w-12 h-12 overflow-hidden flex-shrink-0 rounded">
            <a
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {profile.emoji}
            </a>
          </div>
        )}
        <span
          className={`inline-flex rounded space-x-2 items-start p-3 text-white ${
            tag === "bot" ? "bg-[#4a9c6d]" : "bg-[#363739]"
          } `}
        >
          <span className="font-bold">{profile.username}:&nbsp;</span>

          <span className="max-w-sm">{body}</span>
        </span>
      </div>
      <p className="text-xs text-white/50">
        {created &&
          differenceInHours(new Date(), new Date(created)) >= 1 &&
          formatRelative(new Date(created), new Date())}
        {created &&
          differenceInHours(new Date(), new Date(created)) < 1 &&
          formatDistance(new Date(created), new Date(), {
            addSuffix: true,
          })}
      </p>
    </div>
  );
};
