import { Card, CardContent, CardHeader } from "../../ui/card"
import { Separator } from "../../ui/separator"

export const SectionLayout = {
  SectionHeader: ({ children }: { children: React.ReactNode }) => (
    <CardHeader>
      <div className="mx-4">{children}</div>
    </CardHeader>
  ),
  SectionContent: ({ children }: { children: React.ReactNode }) => (
    <Card>
      <CardContent className="flex flex-col gap-2">{children}</CardContent>
    </Card>
  ),
  SectionEntry: ({
    index,
    children,
  }: {
    index: number
    children: React.ReactNode
  }) => (
    <>
      {index > 0 && <Separator />}
      {children}
    </>
  ),
  EntryFieldsRow: ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-nowrap gap-4 items-start w-full mt-2">
      {children}
    </div>
  ),
}
