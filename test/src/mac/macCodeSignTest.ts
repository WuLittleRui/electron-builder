import { removePassword, TmpDir } from "builder-util"
import { createKeychain } from "electron-builder-lib/out/codeSign"
import { CSC_LINK } from "../helpers/codeSignData"

if (process.env.CSC_KEY_PASSWORD == null) {
  fit("Skip keychain-specific tests because CSC_KEY_PASSWORD is not defined", () => {
    console.warn("[SKIP] Skip keychain-specific tests because CSC_KEY_PASSWORD is not defined")
  })
}

const tmpDir = new TmpDir()

test.ifMac("create keychain", async () => {
  const result = await createKeychain({tmpDir, cscLink: CSC_LINK, cscKeyPassword: process.env.CSC_KEY_PASSWORD!!, currentDir: process.cwd()})
  expect(result.keychainName).not.toEqual("")
})

afterEach(() => tmpDir.cleanup())

test.ifMac("create keychain with installers", async () => {
  const result = await createKeychain({tmpDir, cscLink: CSC_LINK, cscKeyPassword: process.env.CSC_KEY_PASSWORD!!, currentDir: process.cwd()})
  expect(result.keychainName).not.toEqual("")
})

test.ifDevOrLinuxCi("remove password from log", async () => {
  expect(removePassword("seq -P foo -B")).toMatchSnapshot()
  expect(removePassword("pass:foo")).toMatchSnapshot()
  // noinspection SpellCheckingInspection
  expect(removePassword("/usr/bin/productbuild -P wefwef")).toMatchSnapshot()
  expect(removePassword(" /p foo")).toMatchSnapshot()
  expect(removePassword('ConvertTo-SecureString -String "test"')).toMatchSnapshot()
  expect(removePassword('(Get-PfxData "C:\\Users\\develar\\AppData\\Local\\Temp\\electron-builder-yBY8D2\\0-1.p12" -Password (ConvertTo-SecureString -String "test" -Force -AsPlainText)).EndEntityCertificates.Subject')).toMatchSnapshot()
})