import { Directory, configureStructure } from "./mod.ts";

const structure: Directory = {
  type: "Directory",
  name: "generate_src",
  childrens: [
    {
      type: "File",
      name: "index.ts",
      templateFilePath: "./templates/template.ts",
    },
    {
      type: "Directory",
      name: "utils",
      childrens: [
        {
          type: "File",
          name: "index.ts",
          templateFilePath: "./templates/template.ts",
        },
        {
          type: "Directory",
          name: "test",
          childrens: [],
        },
      ],
    },
  ],
};

await configureStructure(structure, ".");
