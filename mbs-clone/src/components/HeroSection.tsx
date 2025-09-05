'use client'

export default function HeroSection() {
  return (
    <section className="relative h-[500px] bg-cover bg-center"
             style={{
               backgroundImage: `url('https://images.squarespace-cdn.com/content/v1/628517c383bb6514e74d2830/1742903505638-2YK2AY0L2MN2Z981KSEC/Youngstown.jpg')`
             }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Category Labels */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full flex">
          {/* Kitchen */}
          <div className="flex-1 h-20 bg-[#e33f3f]/90 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-wider">KITCHEN</span>
          </div>

          {/* Bath */}
          <div className="flex-1 h-20 bg-[#e33f3f]/80 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-wider">BATH</span>
          </div>

          {/* Countertops */}
          <div className="flex-1 h-20 bg-[#e33f3f]/90 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-wider">COUNTERTOPS</span>
          </div>

          {/* Appliances */}
          <div className="flex-1 h-20 bg-[#e33f3f]/80 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-wider">APPLIANCES</span>
          </div>

          {/* Accessories */}
          <div className="flex-1 h-20 bg-[#e33f3f]/90 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-wider">ACCESSORIES</span>
          </div>
        </div>
      </div>
    </section>
  )
}
