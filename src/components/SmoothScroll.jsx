import { ReactLenis } from '@studio-freight/react-lenis'

export function SmoothScroll({ children }) {
    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothTouch: false }}>
            {children}
        </ReactLenis>
    )
}
