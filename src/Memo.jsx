import { useState, useEffect, useCallback } from "react";

const microcmsAdminUrl = document.referer || "https://iframe-memo.microcms.io";

export const Memo = () => {
  const [state, setState] = useState({
    iframeId: "",
    defaultMessage: {},
  });

  const [value, setValue] = useState("");

  const handleChange = (content) => {
    setValue(content);
    postDataToMicroCMS(content);
  };

  useEffect(() => {
    window.addEventListener("message", (e) => {
      if (
        e.isTrusted === true &&
        e.data.action === "MICROCMS_GET_DEFAULT_DATA"
      ) {
        setState({
          iframeId: e.data.id,
          defaultMessage: e.data.message,
        });

        window.parent.postMessage(
          {
            id: e.data.id,
            action: "MICROCMS_UPDATE_STYLE",
            message: {
              height: 220,
            },
          },
          microcmsAdminUrl
        );

        if (e.data.message.description) {
          setValue(e.data.message.description);
        }
      }
    });
  }, []);

  const postDataToMicroCMS = useCallback(
    (content) => {
      window.parent.postMessage(
        {
          id: state.iframeId,
          action: "MICROCMS_POST_DATA",
          message: {
            description: content,
            data: null,
          },
        },
        microcmsAdminUrl
      );
    },
    [state]
  );

  useEffect(() => {
    postDataToMicroCMS(value);
  }, [value, postDataToMicroCMS]);

  return (
    <textarea
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    ></textarea>
  );
};
