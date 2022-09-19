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

export interface IFileHandler {
  makeFile(to: string, from?: string): Promise<void>;
  makeDirectory(directoryPath: string): Promise<void>;
  deleteFile(filePath: string): Promise<void>;
  deleteDirectory(directoryPath: string): Promise<void>;
}

export class FileHandler implements IFileHandler {
  async makeFile(to: string, from?: string | undefined): Promise<void> {
    if (from) {
      await Deno.copyFile(from, to);
    } else {
      await Deno.writeTextFile(to, "");
    }
  }

  async makeDirectory(directoryPath: string): Promise<void> {
    await Deno.mkdir(directoryPath);
  }

  async deleteFile(filePath: string): Promise<void> {
    await Deno.remove(filePath);
  }

  async deleteDirectory(directoryPath: string): Promise<void> {
    await Deno.remove(directoryPath, { recursive: true });
  }
}

const fileHandler = new FileHandler();

export const configureStructure = async (
  directory: Directory,
  baseDir: string
): Promise<void> => {
  await fileHandler.makeDirectory(`${baseDir}/${directory.name}`);

  directory.childrens.map(async (child) => {
    if (child.type === "Directory") {
      return await configureStructure(child, `${baseDir}/${directory.name}`);
    }
    return await fileHandler.makeFile(
      `${baseDir}/${directory.name}/${child.name}`,
      child.templateFilePath
    );
  });
};

export const deleteStructure = async (
  directory: Directory,
  baseDir: string
) => {
  await fileHandler.deleteDirectory(`${baseDir}/${directory.name}`);
};
