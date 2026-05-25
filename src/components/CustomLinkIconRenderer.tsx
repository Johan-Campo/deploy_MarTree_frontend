import { ICON_MAP, isLucideIcon } from "../data/customLinkIcons"

type Props = {
    value: string          // icon id ("Globe") o emoji ("🔗")
    size?: number          // px, default 20
    color?: string         // color override
    className?: string
}

export default function CustomLinkIconRenderer({ value, size = 20, color, className }: Props) {
    if (isLucideIcon(value)) {
        const Icon = ICON_MAP[value]
        return <Icon width={size} height={size} style={{ color }} className={className} strokeWidth={1.8} />
    }
    // Fallback: emoji como texto
    return (
        <span className={className} style={{ fontSize: size * 0.9, lineHeight: 1 }}>
            {value || "🔗"}
        </span>
    )
}
