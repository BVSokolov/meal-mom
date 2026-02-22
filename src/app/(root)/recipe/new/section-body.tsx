const SectionBody = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="h3-bold">{title}</h3>
      {children}
    </div>
  )
}

export default SectionBody
