export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 w-screen h-screen -z-10 overflow-hidden bg-gray-950">

      
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-white/20 animate-float"
          style={{
            left: `${(i * 8) % 100}%`,
            animationDuration: `${10 + (i % 4)}s`,
            animationDelay: `${i * 0.5}s`
          }}
        />
      ))}

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); opacity: 0.4; }
            100% { transform: translateY(-110vh); opacity: 0; }
          }
          .animate-float {
            animation: float linear infinite;
          }
        `}
      </style>
    </div>
  )
}