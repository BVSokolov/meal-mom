import { Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { FC } from "react"
import { Button } from "../../ui/button"

type PositionalButtonsProps = {
  remove: { index: number; fn: (index: number) => void }
  move: { index: number; fn: (index: number, up: boolean) => void }
  className?: string
}
const PositionalButtons: FC<PositionalButtonsProps> = ({
  remove,
  move,
  className,
}) => (
  <div className={`flex gap-2 flex-nowrap w-full  sm:w-auto ${className}`}>
    <Button
      type="button"
      className="w-1 h-6 md:w-9 md:h-9"
      variant="destructive"
      onClick={() => remove.fn(remove.index)}
    >
      <Trash2 width={24} height={24} />
    </Button>
    <Button
      type="button"
      className="w-1 h-6 md:w-9 md:h-9"
      onClick={() => move.fn(move.index, true)}
    >
      <ChevronUp width={24} height={24} />
    </Button>
    <Button
      type="button"
      className="w-1 h-6 md:w-9 md:h-9"
      onClick={() => move.fn(move.index, false)}
    >
      <ChevronDown width={24} height={24} />
    </Button>
  </div>
)

export default PositionalButtons
