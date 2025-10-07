/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Copyright (c) 2025 Piecuuu
 * Licensed under the Apache License. See https://github.com/discordx-ts/discordx/blob/588f84a62c83d3041747032dc085f086db19e8e6/LICENSE.txt for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import { glob } from "glob";
import path from "path";

export async function resolveWithIgnore(ignore: string[] = [], ...paths: string[]): Promise<string[]> {
  const imports: string[] = [];
  const normalizedIgnores = ignore.map(i => i.split(path.sep).join("/"));

  await Promise.all(
    paths.map(async (ps) => {
      const files = await glob(ps.split(path.sep).join("/"));

      files.forEach((file) => {
        const np = file.split(path.sep).join("/");
        if (normalizedIgnores.some(ig => np.includes(ig))) return;

        if (!imports.includes(file)) {
          imports.push(`file://${file}`);
        }
      });
    }),
  );

  return imports;
}

export async function importxWithIgnore(ignore: string[] = [], ...paths: string[]): Promise<void> {
  const files = await resolveWithIgnore(ignore, ...paths);
  await Promise.all(files.map((file) => import(file)));
}