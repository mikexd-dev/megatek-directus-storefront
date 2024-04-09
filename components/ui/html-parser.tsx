import parse, { Element } from "html-react-parser";
import Image from "next/image";
import React from "react";

const htmlParser = ({ body }: { body: string }) => {
  const options = {
    replace: (domNode: any) => {
      if (domNode instanceof Element && domNode.attribs) {
        if (domNode.name === "img") {
          const { src, alt } = domNode.attribs;
          return (
            <Image
              className="object-cover object-center w-full my-3 rounded-md h-auto max-h-[300px] md:max-h-[500px]"
              src={src}
              alt={alt}
              width={1280}
              height={620}
            />
          );
        } else if (domNode.name === "li") {
          return (
            <ul className="list-disc list-inside">
              {domNode.children.map((child, index) => (
                //@ts-ignore
                <li key={index}> {child.data}</li>
              ))}
            </ul>
          );
        }
      }
    },
  };

  const getParsedHTML = (body: string) => {
    return parse(body, options);
  };

  return <div className="rich-text">{getParsedHTML(body)}</div>;
};

export default htmlParser;
