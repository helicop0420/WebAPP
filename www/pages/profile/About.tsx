/* eslint-disable @next/next/no-img-element */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { take } from "lodash";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { ProfilePageView } from "types/views";

interface AboutProps {
  profile: ProfilePageView;
}

export default function About({ profile }: AboutProps) {
  const {
    twitter_url,
    facebook_url,
    instagram_url,
    linkedin_url,
    connections_count,
    mutual_connections = null,
    about,
  } = profile;

  const first2 = take(mutual_connections, 2);
  const first3 = take(mutual_connections, 3);

  return (
    <div className="bg-white rounded-lg px-11 py-5">
      <div className="text-3xl leading-9 font-extrabold tracking-tight text-black">
        About
      </div>
      <div className="text-lg leading-7 font-normal text-gray-500 my-5">
        {about && about}
      </div>
      {connections_count && connections_count > 0 && (
        <div className="px-2 py-1 flex gap-1 text-sm items-center text-gray-500">
          <div className="flex mr-4">
            {first3.splice(0, 3).map(({ profile_pic_url, first_name }, i) => (
              <img
                key={i}
                alt={first_name ? first_name : "Endorsing User"}
                src={profile_pic_url ? profile_pic_url : undefined}
                className="h-7 w-7 -ml-2 rounded-full border border-white"
              />
            ))}
          </div>
          {first2.map(({ first_name, last_name }, i) => (
            <span
              key={i}
              className="text-base leading-6 font-normal text-gray-500"
            >
              <b>
                {first_name && first_name}
                {"  "}
                {last_name && last_name}
              </b>
              ,
            </span>
          ))}
          {connections_count > 2 && (
            <span className="text-base leading-6 font-normal text-gray-500">
              and <b>{connections_count - 2} others</b> in work family{" "}
              <FontAwesomeIcon icon={faQuestionCircle} size="xs" />
            </span>
          )}
        </div>
      )}
      <div className="flex mt-6 gap-6 text-gray-400 text-lg">
        {facebook_url && (
          <a href={facebook_url}>
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </a>
        )}
        {twitter_url && (
          <a href={twitter_url}>
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
        )}
        {instagram_url && (
          <a href={instagram_url}>
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
        )}
        {linkedin_url && (
          <a href={linkedin_url}>
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
        )}
      </div>
    </div>
  );
}
