import { AVATAR_STAGES } from "@/lib/avatar";

function StageEgg() {
  return (
    <g>
      <ellipse cx="100" cy="150" rx="55" ry="14" fill="#EAD9B8" opacity="0.6" />
      <path d="M100 60 C 135 60 150 105 150 130 C 150 158 128 172 100 172 C 72 172 50 158 50 130 C 50 105 65 60 100 60 Z" fill="#FFF7E8" stroke="#E8C994" strokeWidth="3" />
      <path d="M78 96 L92 110 L80 116 L96 132" fill="none" stroke="#E8C994" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="120" cy="95" r="4" fill="#F3D9A4" />
      <circle cx="70" cy="130" r="3" fill="#F3D9A4" />
      <circle cx="128" cy="140" r="3" fill="#F3D9A4" />
    </g>
  );
}

function StageBaby() {
  return (
    <g>
      <ellipse cx="100" cy="165" rx="50" ry="10" fill="#EADFC7" opacity="0.5" />
      <ellipse cx="100" cy="120" rx="15" ry="12" fill="#F4A25C" />
      <ellipse cx="100" cy="110" rx="34" ry="30" fill="#F7B573" />
      <path d="M74 88 L66 66 L88 82 Z" fill="#F7B573" />
      <path d="M126 88 L134 66 L112 82 Z" fill="#F7B573" />
      <ellipse cx="100" cy="118" rx="16" ry="12" fill="#FFF3E2" />
      <circle cx="90" cy="106" r="3.2" fill="#4A3325" />
      <circle cx="110" cy="106" r="3.2" fill="#4A3325" />
      <path d="M96 116 Q100 120 104 116" stroke="#4A3325" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="80" cy="114" rx="4" ry="2.5" fill="#F6B9A0" opacity="0.7" />
      <ellipse cx="120" cy="114" rx="4" ry="2.5" fill="#F6B9A0" opacity="0.7" />
    </g>
  );
}

function StagePlayful() {
  return (
    <g>
      <ellipse cx="100" cy="175" rx="58" ry="10" fill="#EADFC7" opacity="0.5" />
      <path d="M136 150 C 168 145 178 115 158 100 C 172 108 170 140 140 158 Z" fill="#F2A45A" />
      <path d="M170 118 C 176 122 176 132 168 134 C 172 128 170 122 163 119 Z" fill="#FBEFE1" />
      <ellipse cx="100" cy="150" rx="30" ry="26" fill="#F7B573" />
      <ellipse cx="100" cy="152" rx="16" ry="14" fill="#FFF3E2" />
      <ellipse cx="100" cy="100" rx="36" ry="32" fill="#F7B573" />
      <path d="M72 76 L62 48 L88 70 Z" fill="#F7B573" />
      <path d="M128 76 L138 48 L112 70 Z" fill="#F7B573" />
      <path d="M74 64 L69 52 L83 63 Z" fill="#FBEFE1" />
      <path d="M126 64 L131 52 L117 63 Z" fill="#FBEFE1" />
      <ellipse cx="100" cy="110" rx="18" ry="13" fill="#FFF3E2" />
      <circle cx="88" cy="96" r="4" fill="#3B2A1E" />
      <circle cx="112" cy="96" r="4" fill="#3B2A1E" />
      <path d="M94 110 Q100 116 106 110" stroke="#3B2A1E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="76" cy="106" rx="5" ry="3" fill="#F6B9A0" opacity="0.8" />
      <ellipse cx="124" cy="106" rx="5" ry="3" fill="#F6B9A0" opacity="0.8" />
      <ellipse cx="66" cy="150" rx="9" ry="20" fill="#F7B573" transform="rotate(-18 66 150)" />
    </g>
  );
}

function StageReliable() {
  return (
    <g>
      <ellipse cx="100" cy="182" rx="62" ry="10" fill="#EADFC7" opacity="0.5" />
      <path d="M140 158 C 178 150 190 108 162 88 C 182 98 182 142 144 168 Z" fill="#EE9847" />
      <path d="M180 100 C 187 105 187 118 178 121 C 182 113 180 106 172 102 Z" fill="#FBEFE1" />
      <ellipse cx="100" cy="152" rx="34" ry="30" fill="#F2A45A" />
      <path d="M70 148 C 100 168 130 168 150 148 L150 160 C 128 176 92 176 70 160 Z" fill="#4E7FB0" />
      <ellipse cx="100" cy="154" rx="18" ry="16" fill="#FFF3E2" />
      <ellipse cx="100" cy="96" rx="40" ry="35" fill="#F2A45A" />
      <path d="M68 68 L56 36 L86 62 Z" fill="#F2A45A" />
      <path d="M132 68 L144 36 L114 62 Z" fill="#F2A45A" />
      <path d="M70 56 L64 42 L80 58 Z" fill="#FBEFE1" />
      <path d="M130 56 L136 42 L120 58 Z" fill="#FBEFE1" />
      <ellipse cx="100" cy="108" rx="20" ry="14" fill="#FFF3E2" />
      <circle cx="86" cy="90" r="4.4" fill="#2E2013" />
      <circle cx="114" cy="90" r="4.4" fill="#2E2013" />
      <path d="M92 106 Q100 113 108 106" stroke="#2E2013" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx="72" cy="100" rx="5.5" ry="3.4" fill="#F6B9A0" opacity="0.8" />
      <ellipse cx="128" cy="100" rx="5.5" ry="3.4" fill="#F6B9A0" opacity="0.8" />
    </g>
  );
}

function StageLegendary() {
  return (
    <g>
      <ellipse cx="100" cy="184" rx="66" ry="10" fill="#F6E9C6" opacity="0.6" />
      <g opacity="0.9">
        <path d="M150 20 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" fill="#F6D470" />
        <path d="M40 34 l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5 Z" fill="#F6D470" />
        <path d="M164 150 l2.5 6.5 6.5 2.5 -6.5 2.5 -2.5 6.5 -2.5 -6.5 -6.5 -2.5 6.5 -2.5 Z" fill="#F6D470" />
      </g>
      <path d="M145 160 C 186 154 200 106 168 82 C 190 92 192 142 150 172 Z" fill="#E8B23A" />
      <path d="M138 158 C 172 158 182 120 158 100 C 176 112 174 148 142 168 Z" fill="#F4CE6C" />
      <path d="M188 96 C 196 101 196 116 186 119 C 190 110 188 102 179 98 Z" fill="#FFF7DE" />
      <ellipse cx="100" cy="150" rx="36" ry="32" fill="#F2A45A" />
      <path d="M66 146 C 100 168 132 168 154 146 L154 158 C 130 176 90 176 66 158 Z" fill="#5C87B8" />
      <circle cx="70" cy="152" r="3.5" fill="#F6D470" />
      <circle cx="150" cy="152" r="3.5" fill="#F6D470" />
      <ellipse cx="100" cy="152" rx="19" ry="17" fill="#FFF3E2" />
      <ellipse cx="100" cy="92" rx="42" ry="37" fill="#F2A45A" />
      <path d="M64 62 L50 28 L84 56 Z" fill="#F2A45A" />
      <path d="M136 62 L150 28 L116 56 Z" fill="#F2A45A" />
      <path d="M67 50 L60 34 L78 52 Z" fill="#FFF3E2" />
      <path d="M133 50 L140 34 L122 52 Z" fill="#FFF3E2" />
      <ellipse cx="100" cy="104" rx="21" ry="15" fill="#FFF3E2" />
      <circle cx="85" cy="86" r="4.6" fill="#241a10" />
      <circle cx="115" cy="86" r="4.6" fill="#241a10" />
      <path d="M91 102 Q100 110 109 102" stroke="#241a10" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <ellipse cx="70" cy="96" rx="5.5" ry="3.4" fill="#F6B9A0" opacity="0.85" />
      <ellipse cx="130" cy="96" rx="5.5" ry="3.4" fill="#F6B9A0" opacity="0.85" />
    </g>
  );
}

const STAGE_RENDER = [StageEgg, StageBaby, StagePlayful, StageReliable, StageLegendary];

export function Avatar({ stage, size = 140, className = "" }: { stage: number; size?: number; className?: string }) {
  const Render = STAGE_RENDER[Math.min(Math.max(stage - 1, 0), STAGE_RENDER.length - 1)];
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label={AVATAR_STAGES[stage - 1]?.name ?? "アバター"}>
      <Render />
    </svg>
  );
}
