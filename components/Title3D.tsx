'use client';

interface Title3DProps {
  className?: string;
}

export function Title3D({ className = "" }: Title3DProps) {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Circular white radial gradient background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.05) 60%, transparent 100%)',
          width: '320px',
          height: '320px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* Main title */}
      <h1 
        className="relative z-10 font-black uppercase tracking-wider leading-none select-none"
        style={{
          fontSize: 'clamp(1rem, 3vw, 2rem)',
          color: '#ffffff',
          textShadow: `
            /* Blue outline layers */
            -2px -2px 0 #1e40af,
            2px -2px 0 #1e40af,
            -2px 2px 0 #1e40af,
            2px 2px 0 #1e40af,
            -3px -3px 0 #1e40af,
            3px -3px 0 #1e40af,
            -3px 3px 0 #1e40af,
            3px 3px 0 #1e40af,
            /* White glow */
            0 0 10px rgba(255,255,255,0.8),
            0 0 20px rgba(255,255,255,0.6),
            0 0 30px rgba(255,255,255,0.4),
            /* Deep 3D shadow layers */
            4px 4px 0 rgba(30,64,175,0.8),
            5px 5px 0 rgba(30,64,175,0.7),
            6px 6px 0 rgba(30,64,175,0.6),
            7px 7px 0 rgba(30,64,175,0.5),
            8px 8px 0 rgba(30,64,175,0.4),
            9px 9px 0 rgba(30,64,175,0.3),
            10px 10px 0 rgba(30,64,175,0.2),
            /* Final drop shadow */
            12px 12px 20px rgba(0,0,0,0.4),
            16px 16px 30px rgba(0,0,0,0.2)
          `,
          filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.5))',
          WebkitTextStroke: '1px #1e40af',
        }}
      >
        TEST THE
      </h1>
      
      {/* Subtitle */}
      <h2 
        className="relative z-10 font-black uppercase tracking-wider leading-none select-none mt-1"
        style={{
          fontSize: 'clamp(1.75rem, 7vw, 3.5rem)',
          color: '#ffffff',
          textShadow: `
            /* Blue outline layers */
            -2px -2px 0 #1e40af,
            2px -2px 0 #1e40af,
            -2px 2px 0 #1e40af,
            2px 2px 0 #1e40af,
            -3px -3px 0 #1e40af,
            3px -3px 0 #1e40af,
            -3px 3px 0 #1e40af,
            3px 3px 0 #1e40af,
            /* White glow */
            0 0 8px rgba(255,255,255,0.8),
            0 0 16px rgba(255,255,255,0.6),
            0 0 24px rgba(255,255,255,0.4),
            /* Deep 3D shadow layers */
            3px 3px 0 rgba(30,64,175,0.8),
            4px 4px 0 rgba(30,64,175,0.7),
            5px 5px 0 rgba(30,64,175,0.6),
            6px 6px 0 rgba(30,64,175,0.5),
            7px 7px 0 rgba(30,64,175,0.4),
            8px 8px 0 rgba(30,64,175,0.3),
            /* Final drop shadow */
            10px 10px 15px rgba(0,0,0,0.4),
            12px 12px 25px rgba(0,0,0,0.2)
          `,
          filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.5))',
          WebkitTextStroke: '1px #1e40af',
        }}
      >
        CLASSICS
      </h2>
    </div>
  );
}