export type CreateFile = {
  type: "File";
  name: string;
  templateFilePath?: string;
};

export type Directory = {
  type: "Directory";
  name: string;
  childrens: Array<Directory | CreateFile>;
};

const makeFile = async (to: string, from?: string): Promise<void> => {
  console.info(`called makeFile. to: ${to}, from: ${from}`);
  if (from) {
    await Deno.copyFile(from, to);
  } else {
    await Deno.writeTextFile(to, "");
  }
};

const makeDirectory = async (directoryPath: string): Promise<void> => {
  console.info(`called makeDirectory. directoryPath: ${directoryPath}`);
  await Deno.mkdir(directoryPath);
};

const deleteDirectory = async (directoryPath: string): Promise<void> => {
  await Deno.remove(directoryPath, { recursive: true });
};

export const configureStructure = async (
  directory: Directory,
  baseDir: string
): Promise<void> => {
  console.info(
    `called configureStructure. directory: ${JSON.stringify(
      directory
    )}, baseDir: ${baseDir}`
  );
  await makeDirectory(`${baseDir}/${directory.name}`);

  directory.childrens.map(async (child) => {
    if (child.type === "Directory") {
      return await configureStructure(child, `${baseDir}/${directory.name}`);
    }
    return await makeFile(
      `${baseDir}/${directory.name}/${child.name}`,
      child.templateFilePath
    );
  });
};

export const deleteStructure = async (
  directory: Directory,
  baseDir: string
) => {
  await deleteDirectory(`${baseDir}/${directory.name}`);
};
