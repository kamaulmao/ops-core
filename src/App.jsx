import { useState, useEffect, useRef } from "react";
import {
  Home, Lightbulb, BarChart2, CalendarDays, Send, History,
  Flame, Settings, Link, Unlink, TrendingUp, ChevronDown, ChevronUp,
  Zap, Plus, X, CheckCircle, UploadCloud, Camera, Calendar, Timer,
  Sparkles, Rocket, Music, Brain, PlaySquare, Star, Target, Shuffle,
} from "lucide-react";

// ─── GLOBAL STYLES COMPONENT ──────────────────────────────────────────────────
// Rendered inline in JSX — artifact sandbox blocks document.head manipulation
function GlobalStyles({primary}) {
  const css = `

    input[type=range] { -webkit-appearance:none; height:4px; border-radius:4px; outline:none; cursor:pointer; }
    input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px;
      background:${primary}; border-radius:50%; border:2px solid #fff; cursor:pointer;
      box-shadow:0 0 10px rgba(255,36,0,0.35); }
    @keyframes slideUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeSlide { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes ripple { 0%{transform:scale(0);opacity:0.5} 100%{transform:scale(3);opacity:0} }
    @keyframes liquidIn {
      from{opacity:0;filter:blur(10px) saturate(0.3);transform:scale(0.96) translateY(8px)}
      to{opacity:1;filter:blur(0px) saturate(1);transform:scale(1) translateY(0)}
    }
    @keyframes navPop {
      0%{transform:scale(0.85) translateY(4px);opacity:0.5}
      60%{transform:scale(1.1) translateY(-2px);opacity:1}
      100%{transform:scale(1) translateY(0);opacity:1}
    }
    @keyframes glassShimmer {
      0%{background-position:200% center}
      100%{background-position:-200% center}
    }
    .tab-enter { animation: liquidIn 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }
    .nav-active { animation: navPop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
    ::-webkit-scrollbar { width:3px; }
    ::-webkit-scrollbar-track { background:#0e0e0e; }
    ::-webkit-scrollbar-thumb { background:#353534; border-radius:4px; }
  `;
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Hanken+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@500;700&display=swap" />
      <style dangerouslySetInnerHTML={{__html: css}} />
    </>
  );
}

// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  scarlet: {
    name: "Vibrant Scarlet",
    swatch: "#ff2400",
    bg: "#131313", surface: "#201f1f", surfaceLow: "#1c1b1b",
    surfaceHigh: "#2a2a2a", surfaceHighest: "#353534",
    primary: "#ff2400", onPrimary: "#ffffff",
    outline: "#b0877f", outlineVariant: "#5f3f38",
    onSurface: "#e5e2e1", onSurfaceVariant: "#eabcb3",
    tertiary: "#ffb4a6", green: "#4ade80", orange: "#ff9900", purple: "#c084fc",
    glass: "rgba(32,31,31,0.55)",
    glassBorder: "rgba(255,36,0,0.12)",
    glassBlur: "blur(24px) saturate(180%)",
    gradBtn: "linear-gradient(135deg,#ff2400 0%,#d41e00 100%)",
    glow: "0 4px 24px rgba(255,36,0,0.28)",
  },
  highvel: {
    name: "High-Velocity",
    swatch: "#ff0000",
    bg: "#000000", surface: "#111111", surfaceLow: "#0d0d0d",
    surfaceHigh: "#1e1e1e", surfaceHighest: "#2a2a2a",
    primary: "#ff0000", onPrimary: "#fff",
    outline: "#b18780", outlineVariant: "#603e39",
    onSurface: "#e5e2e1", onSurfaceVariant: "#ebbbb4",
    tertiary: "#ffb4a8", green: "#4ade80", orange: "#ff9900", purple: "#c084fc",
    glass: "rgba(255,255,255,0.03)",
    glassBorder: "rgba(255,180,168,0.15)",
    glassBlur: "blur(32px) saturate(200%)",
    gradBtn: "linear-gradient(135deg,#ff0000 0%,#cc0000 100%)",
    glow: "0 4px 28px rgba(255,0,0,0.2)",
  },
  midnight: {
    name: "Midnight Carbon",
    swatch: "#ff4444",
    bg: "#0a0a0f", surface: "#12121a", surfaceLow: "#0e0e16",
    surfaceHigh: "#1a1a25", surfaceHighest: "#22223a",
    primary: "#ff4444", onPrimary: "#fff",
    outline: "#8888aa", outlineVariant: "#3a3a5a",
    onSurface: "#e0e0f0", onSurfaceVariant: "#9090b0",
    tertiary: "#aaaaff", green: "#4ade80", orange: "#ff9900", purple: "#a78bfa",
    glass: "rgba(18,18,26,0.6)",
    glassBorder: "rgba(100,100,200,0.15)",
    glassBlur: "blur(28px) saturate(160%)",
    gradBtn: "linear-gradient(135deg,#ff4444 0%,#cc2222 100%)",
    glow: "0 4px 24px rgba(255,68,68,0.22)",
  },
};

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CHANNEL_ID = "UC4Rqw7j1XyYGEvJGqaWY5Ng";
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const METHOD_META = {
  ZOINK_TWIST:       { label:"ZOINK & TWIST",  icon:"swap_horiz", colorKey:"primary" },
  NICHE_BEND:        { label:"NICHE BEND",     icon:"adjust",     colorKey:"orange" },
  VIRAL_DECONSTRUCT: { label:"VIRAL DECODE",   icon:"analytics",  colorKey:"tertiary" },
  ORIGINAL:          { label:"ORIGINAL",       icon:"lightbulb",  colorKey:"purple" },
};

const PLATFORM_CFG = {
  youtube:   { color:"#ff3c3c", icon:"smart_display", name:"YouTube Shorts" },
  tiktok:    { color:"#ee1d52", icon:"music_note",    name:"TikTok" },
  instagram: { color:"#c13584", icon:"photo_camera",  name:"Instagram Reels" },
};

const ZOINK_SYSTEM = `You are the CrimsonCactus content strategist for a Roblox YouTube Shorts channel.
Generate viral Roblox Short ideas using:
1. ZOINK_TWIST — Port a viral non-gaming format into Roblox.
2. NICHE_BEND — Mutate a proven Roblox niche with a new mechanic/emotion.
3. VIRAL_DECONSTRUCT — Deconstruct why something went viral, rebuild for Roblox.
4. ORIGINAL — Completely original concept not based on existing trends.
Output JSON array only, no markdown:
[{"title":"CAPS for emphasis","hook":"First 2 seconds","niche":"Roblox niche","method":"ZOINK_TWIST|NICHE_BEND|VIRAL_DECONSTRUCT|ORIGINAL","concept":"1-2 sentences","recordingFocus":["3 bullets"],"editingFocus":["3 bullets"],"viralMechanism":"Why rewatches","difficulty":"Easy|Medium|Hard","estimatedTime":"X mins"}]`;

// ─── API ──────────────────────────────────────────────────────────────────────
async function callClaude(system, userMsg, useMCP = false, maxTokens = 4000) {
  const body = { model:"claude-sonnet-4-20250514", max_tokens:maxTokens, system, messages:[{role:"user",content:userMsg}] };
  if (useMCP) body.mcp_servers = [{type:"url",url:"https://mcp.vidiq.com/mcp",name:"vidiq"}];
  const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data = await res.json();
  return (data.content||[]).map(b=>b.type==="text"?b.text:b.type==="mcp_tool_result"?(b.content?.[0]?.text||""):"").filter(Boolean).join("\n");
}

function safeParseIdeas(raw) {
  const clean = raw.replace(/```json|```/g,"").trim();
  try { const m=clean.match(/\[[\s\S]*\]/); if(m) return JSON.parse(m[0]); } catch(_){}
  const out=[]; let d=0,s=-1;
  for(let i=0;i<clean.length;i++){
    if(clean[i]==="{"){if(d===0)s=i;d++;}
    else if(clean[i]==="}"){d--;if(d===0&&s!==-1){try{out.push(JSON.parse(clean.slice(s,i+1)));}catch(_){}s=-1;}}
  }
  return out;
}

// ─── YOUTUBE ──────────────────────────────────────────────────────────────────
const YT_SCOPE="https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube";
function ytAuthURL(clientId) {
  return "https://accounts.google.com/o/oauth2/v2/auth?"+new URLSearchParams({client_id:clientId,redirect_uri:window.location.origin+window.location.pathname,response_type:"token",scope:YT_SCOPE,include_granted_scopes:"true"});
}
function extractYTToken() {
  if(!window.location.hash) return null;
  const p=new URLSearchParams(window.location.hash.substring(1));
  const t=p.get("access_token");
  if(t){window.history.replaceState(null,"",window.location.pathname);return t;}
  return null;
}
async function ytUpload(token,file,meta) {
  const r=await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",{
    method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json","X-Upload-Content-Type":file.type,"X-Upload-Content-Length":file.size},
    body:JSON.stringify({snippet:{title:meta.title,description:meta.description,tags:meta.tags||[],categoryId:"20"},status:{privacyStatus:meta.scheduleTime?"private":"public",selfDeclaredMadeForKids:false,...(meta.scheduleTime?{publishAt:meta.scheduleTime}:{})}}),
  });
  if(!r.ok) throw new Error("YT init failed: "+r.status);
  const url=r.headers.get("Location"); if(!url) throw new Error("No upload URL");
  const u=await fetch(url,{method:"PUT",headers:{"Content-Type":file.type},body:file});
  if(!u.ok) throw new Error("Upload failed: "+u.status);
  return (await u.json()).id;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function load(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(_){return d;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(_){}}
function hexRgb(hex){const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);return r?parseInt(r[1],16)+","+parseInt(r[2],16)+","+parseInt(r[3],16):"255,36,0";}



const ICON_MAP = {
  home:               Home,
  lightbulb:          Lightbulb,
  analytics:          BarChart2,
  calendar_month:     CalendarDays,
  publish:            Send,
  history:            History,
  local_fire_department: Flame,
  settings:           Settings,
  settings_suggest:   Settings,
  link:               Link,
  link_off:           Unlink,
  trending_up:        TrendingUp,
  expand_more:        ChevronDown,
  expand_less:        ChevronUp,
  bolt:               Zap,
  add:                Plus,
  close:              X,
  check_circle:       CheckCircle,
  upload_file:        UploadCloud,
  photo_camera:       Camera,
  calendar_today:     Calendar,
  timer:              Timer,
  auto_awesome:       Sparkles,
  rocket_launch:      Rocket,
  smart_display:      PlaySquare,
  music_note:         Music,
  swap_horiz:         Shuffle,
  adjust:             Target,
  psychology:         Brain,
  monitoring:         BarChart2,
};

function Icon({name, size=20, fill=0, color, style={}}) {
  const LucideIcon = ICON_MAP[name] || Star;
  const c = color || "currentColor";
  return (
    <LucideIcon
      size={size}
      color={c}
      fill={fill===1 ? c : "none"}
      strokeWidth={1.8}
      style={{display:"inline-block",verticalAlign:"middle",flexShrink:0,...style}}
    />
  );
}

// ─── LIQUID GLASS CARD ────────────────────────────────────────────────────────
function Glass({T, children, style={}, glow, accent}) {
  return (
    <div style={{
      background: T.glass,
      backdropFilter: T.glassBlur,
      WebkitBackdropFilter: T.glassBlur,
      border: "1px solid "+(accent?accent+"33":T.glassBorder),
      borderRadius: 12,
      boxShadow: glow ? T.glow+", inset 0 1px 0 rgba(255,255,255,0.06)" : "inset 0 1px 0 rgba(255,255,255,0.04)",
      ...style,
    }}>{children}</div>
  );
}

// ─── RIPPLE BUTTON ────────────────────────────────────────────────────────────
function RippleBtn({onClick,disabled,children,T,full,variant="primary",small}) {
  const ref = useRef();
  function handleClick(e) {
    if(disabled) return;
    const btn = ref.current; if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width,rect.height)*2;
    ripple.style.cssText = "position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);width:"+size+"px;height:"+size+"px;left:"+(e.clientX-rect.left-size/2)+"px;top:"+(e.clientY-rect.top-size/2)+"px;animation:ripple 0.5s linear;pointer-events:none;";
    btn.appendChild(ripple);
    setTimeout(()=>ripple.remove(),500);
    onClick && onClick(e);
  }
  const isPrimary = variant==="primary";
  const isOutline = variant==="outline";
  return (
    <button ref={ref} onClick={handleClick} disabled={disabled} style={{
      position:"relative", overflow:"hidden",
      width:full?"100%":undefined,
      background: isPrimary ? (disabled?"#2a2a2a":T.gradBtn) : "transparent",
      color: isPrimary ? (disabled?"#555":"#fff") : T.onSurfaceVariant,
      border: isPrimary ? "none" : "1px solid "+T.outlineVariant,
      borderRadius: 10,
      padding: small ? "6px 14px" : "12px 20px",
      fontFamily:"'Hanken Grotesk',sans-serif", fontWeight:700,
      fontSize: small?10:12, cursor:disabled?"not-allowed":"pointer",
      letterSpacing:"0.05em", textTransform:"uppercase",
      boxShadow: isPrimary&&!disabled ? T.glow : "none",
      transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
      display:"flex", alignItems:"center", justifyContent:"center", gap:6,
    }}>{children}</button>
  );
}


// ─── PLATFORM KIT CARD ────────────────────────────────────────────────────────
function PlatformKit({p, T, S, kits, setKits, copiedPlat, copyKit}) {
  const [open, setOpen] = useState(false);
  const cfg = PLATFORM_CFG[p];
  const k = kits?.[p];
  function updateField(field, val) {
    if(!setKits) return;
    setKits(prev=>({...prev,[p]:{...prev[p],[field]:val}}));
  }
  const inputStyle = {width:"100%",background:T.surfaceLow,border:"1px solid "+T.outlineVariant+"66",borderRadius:6,color:T.onSurface,padding:"8px 10px",fontSize:12,fontFamily:"'Hanken Grotesk',sans-serif",outline:"none",boxSizing:"border-box"};
  const labelStyle = {fontSize:9,fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,color:T.onSurfaceVariant,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4,marginTop:10,display:"block"};
  return (
    <div style={{marginBottom:8,overflow:"hidden",border:"1px solid rgba("+hexRgb(cfg.color)+",0.2)",background:T.glass,backdropFilter:T.glassBlur,WebkitBackdropFilter:T.glassBlur,borderRadius:12}}>
      <div onClick={()=>setOpen(!open)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Icon name={cfg.icon} size={17} color={cfg.color}/>
          <span style={{fontFamily:"'Sora',sans-serif",fontSize:13,fontWeight:700,color:T.onSurface}}>{cfg.name}</span>
          {copiedPlat===p&&<span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:T.green}}>COPIED</span>}
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <button onClick={e=>{e.stopPropagation();copyKit(p);}} style={{background:cfg.color,color:"#fff",border:"none",borderRadius:6,padding:"4px 10px",fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,fontSize:9,cursor:"pointer",letterSpacing:"0.05em"}}>COPY</button>
          <Icon name={open?"expand_less":"expand_more"} size={17} color={T.outlineVariant}/>
        </div>
      </div>
      {open&&k&&(
        <div style={{padding:"0 14px 14px",borderTop:"1px solid "+T.outlineVariant+"33"}}>
          <span style={labelStyle}>TITLE</span>
          <input value={k.title||""} onChange={e=>updateField("title",e.target.value)}
            style={{...inputStyle,fontFamily:"'Sora',sans-serif",fontWeight:600}}/>
          <span style={labelStyle}>DESCRIPTION</span>
          <textarea value={k.description||""} onChange={e=>updateField("description",e.target.value)}
            rows={4} style={{...inputStyle,resize:"vertical",lineHeight:1.6,fontSize:11}}/>
          <span style={labelStyle}>HASHTAGS <span style={{color:T.outlineVariant,fontWeight:400,textTransform:"none",letterSpacing:0}}>(space separated)</span></span>
          <input value={(k.hashtags||[]).join(" ")} onChange={e=>updateField("hashtags",e.target.value.split(" ").filter(Boolean))}
            style={inputStyle} placeholder="#roblox #shorts"/>
          {k.tags&&(
            <>
              <span style={labelStyle}>TAGS <span style={{color:T.outlineVariant,fontWeight:400,textTransform:"none",letterSpacing:0}}>(YouTube SEO tags, comma separated)</span></span>
              <input value={(k.tags||[]).join(", ")} onChange={e=>updateField("tags",e.target.value.split(",").map(t=>t.trim()).filter(Boolean))}
                style={inputStyle} placeholder="roblox, shorts, lucky block"/>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {

  const [themeKey, setThemeKey] = useState(()=>load("cc_theme","scarlet"));
  const T = THEMES[themeKey] || THEMES.scarlet;

  const [tab, setTab]               = useState("overview");
  const [prevTab, setPrevTab]       = useState(null);
  const [tabKey, setTabKey]         = useState(0); // forces re-mount for animation

  // Persistent data
  const [ideas,      setIdeas]      = useState(()=>load("cc_ideas",[]));
  const [calendar,   setCalendar]   = useState(()=>load("cc_calendar",{}));
  const [history,    setHistory]    = useState(()=>load("cc_history",[]));
  const [slog,       setSlog]       = useState(()=>load("cc_slog",[]));
  const [ytClientId, setYtClientId] = useState(()=>load("cc_yt_client_id",""));

  // Session
  const [ytToken,      setYtToken]      = useState(null);
  const [trendData,    setTrendData]    = useState(null);
  const [trendLoading, setTrendLoading] = useState(false);
  const [trendAge,     setTrendAge]     = useState(null);

  // Generate
  const [genLoading, setGenLoading] = useState(false);
  const [genStatus,  setGenStatus]  = useState("");
  const [count,      setCount]      = useState(5);
  const [method,     setMethod]     = useState("ALL");
  const [decodeInput,setDecodeInput]= useState("");

  // Post
  const [videoFile,    setVideoFile]    = useState(null);
  const [videoLink,    setVideoLink]    = useState("");
  const [videoNotes,   setVideoNotes]   = useState("");
  const [customTitle,  setCustomTitle]  = useState("");
  const [customTags,   setCustomTags]   = useState("");
  const [postDay,      setPostDay]      = useState(DAYS[Math.max(0,new Date().getDay()-1)]);
  const [postTime,     setPostTime]     = useState("15:00");
  const [postSchedule, setPostSchedule] = useState("now");
  const [kits,         setKits]         = useState(null);
  const [kitLoading,   setKitLoading]   = useState(false);
  const [kitStatus,    setKitStatus]    = useState("");
  const [copiedPlat,   setCopiedPlat]   = useState(null);
  const [ytUploading,  setYtUploading]  = useState(false);
  const [ytProgress,   setYtProgress]   = useState("");

  // Modals
  const [scheduleModal, setScheduleModal] = useState(null);
  const [showSettings,  setShowSettings]  = useState(false);

  const scheduledTitles = Object.values(calendar).flat().map(i=>i.title);
  const totalScheduled = Object.values(calendar).flat().length;

  // Persist
  useEffect(()=>save("cc_ideas",ideas),[ideas]);
  useEffect(()=>save("cc_calendar",calendar),[calendar]);
  useEffect(()=>save("cc_history",history),[history]);
  useEffect(()=>save("cc_slog",slog),[slog]);
  useEffect(()=>save("cc_yt_client_id",ytClientId),[ytClientId]);
  useEffect(()=>save("cc_theme",themeKey),[themeKey]);

  useEffect(()=>{
    const t=extractYTToken(); if(t)setYtToken(t);
    prefetchTrends();
  },[]);

  function switchTab(newTab) {
    if(newTab===tab) return;
    setPrevTab(tab);
    setTab(newTab);
    setTabKey(k=>k+1);
  }

  function buildPref(log) {
    if(!log.length) return null;
    const cnt=key=>log.reduce((a,x)=>{a[x[key]]=(a[x[key]]||0)+1;return a;},{});
    const top=(obj,n=3)=>Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,n).map(([k])=>k);
    return "LEARNED FROM "+log.length+" SCHEDULED:\n- Niches: "+top(cnt("niche")).join(", ")+"\n- Methods: "+top(cnt("method")).join(", ")+"\n- Difficulty: "+(top(cnt("difficulty"),1)[0]||"Medium")+"\n- Recent hooks: "+log.slice(-5).map(i=>i.hook).filter(Boolean).join(" | ");
  }

  async function prefetchTrends() {
    setTrendLoading(true);
    try {
      const d=await callClaude("You are a vidIQ fetcher. Use MCP to get trending Roblox Shorts. Plain text max 200 words, no JSON.","Use vidiq_trending_videos and vidiq_outliers for channel "+CHANNEL_ID+". Summarize top Roblox Shorts niches and titles.",true,1000);
      setTrendData(d); setTrendAge(new Date());
    } catch(_){ setTrendData("Top niches: Lucky Blocks, Steal a Brainrot, Obby, Adopt Me, Blade Ball."); }
    setTrendLoading(false);
  }

  async function generateIdeas() {
    setGenLoading(true); setGenStatus("Generating...");
    try {
      const mf=method==="ALL"?"Use all four methods including ORIGINAL.":"Focus on "+method+".";
      const raw=await callClaude(ZOINK_SYSTEM,"Trend context:\n"+(trendData||"Use training knowledge.")+"\n\n"+(buildPref(slog)||"")+"\n\nGenerate "+count+" ideas for CrimsonCactus. "+mf+" JSON array only.");
      const p=safeParseIdeas(raw);
      if(!p.length) throw new Error("No ideas returned");
      setIdeas(p); setGenStatus(p.length+" ideas ready");
    } catch(e){setGenStatus("Error: "+e.message);}
    setGenLoading(false);
  }

  async function decodeViral() {
    if(!decodeInput.trim()) return;
    setGenLoading(true); setGenStatus("Decoding...");
    try {
      const raw=await callClaude(ZOINK_SYSTEM,"Decode why this went viral, generate 3 Roblox Short remakes using VIRAL_DECONSTRUCT:\n\n\""+decodeInput+"\"\n\nJSON array of 3 only.");
      const p=safeParseIdeas(raw);
      if(!p.length) throw new Error("Parse failed");
      setIdeas(prev=>[...p,...prev]); setGenStatus("Added "+p.length+" ideas"); switchTab("generate");
    } catch(e){setGenStatus("Error: "+e.message);}
    setGenLoading(false);
  }

  function scheduleIdea(idea,day) {
    setCalendar(prev=>({...prev,[day]:[...(prev[day]||[]),idea]}));
    setSlog(prev=>[...prev,{...idea,scheduledAt:new Date().toISOString()}]);
    setScheduleModal(null);
  }
  function removeFromCal(day,idx){setCalendar(prev=>{const u=[...(prev[day]||[])];u.splice(idx,1);return{...prev,[day]:u};});}
  function autoFill(){const pool=ideas.filter(i=>!scheduledTitles.includes(i.title));const nc={...calendar};for(const d of DAYS){if(!pool.length)break;if(!nc[d]?.length)nc[d]=[pool.shift()];}setCalendar(nc);}

  async function generateKits() {
    const matched=(calendar[postDay]||[])[0];
    const vidCtx=videoFile?"File: \""+videoFile.name+"\"":videoLink?"Link: "+videoLink:"No video";
    const ideaCtx=matched?"Idea: \""+matched.title+"\" — "+matched.concept+" — niche: "+matched.niche+" — method: "+matched.method:"No idea scheduled for "+postDay;
    const overrides=(customTitle||customTags)?"\nCREATOR OVERRIDES:"+(customTitle?"\n- Use this title: \""+customTitle+"\"":"")+(customTags?"\n- Include these tags: "+customTags:""):"";
    setKitLoading(true); setKitStatus("Building kits...");
    try {
      const raw=await callClaude("Social media expert for CrimsonCactus Roblox Shorts. Return JSON only:\n{\"youtube\":{\"title\":\"max 100 chars\",\"description\":\"3-4 lines + CTA\",\"hashtags\":[\"#Roblox\",...8],\"tags\":[\"roblox\",...15]},\"tiktok\":{\"title\":\"caption under 150\",\"description\":\"caption + CTA\",\"hashtags\":[...10]},\"instagram\":{\"title\":\"title\",\"description\":\"emoji caption + CTA\",\"hashtags\":[...15]}}",
        vidCtx+"\n"+ideaCtx+(videoNotes?"\nNotes: "+videoNotes:"")+overrides+"\nJSON only.");
      const m=raw.replace(/```json|```/g,"").trim().match(/\{[\s\S]*\}/);
      if(!m) throw new Error("No kit data");
      setKits(JSON.parse(m[0])); setKitStatus("Kits ready");
    } catch(e){setKitStatus("Error: "+e.message);}
    setKitLoading(false);
  }

  function copyKit(p){
    if(!kits?.[p]) return;
    const k=kits[p];
    navigator.clipboard.writeText(k.title+"\n\n"+k.description+"\n\n"+(k.hashtags||[]).join(" ")).then(()=>{setCopiedPlat(p);setTimeout(()=>setCopiedPlat(null),2000);});
  }

  async function postToYT() {
    if(!ytToken||!videoFile||!kits?.youtube) return;
    setYtUploading(true); setYtProgress("Uploading...");
    try {
      let sched=null;
      if(postSchedule==="scheduled"){
        const now=new Date();const di=DAYS.indexOf(postDay);const ti=now.getDay()===0?6:now.getDay()-1;
        let diff=di-ti;if(diff<0)diff+=7;
        const tgt=new Date(now);tgt.setDate(tgt.getDate()+diff);
        const [h,m]=postTime.split(":").map(Number);tgt.setHours(h,m,0,0);sched=tgt.toISOString();
      }
      const ytId=await ytUpload(ytToken,videoFile,{title:kits.youtube.title,description:kits.youtube.description+"\n\n"+(kits.youtube.hashtags||[]).join(" "),tags:kits.youtube.tags||[],scheduleTime:sched});
      setYtProgress("Live! ID: "+ytId);
      setHistory(prev=>[{id:Date.now(),title:kits.youtube.title,ytId,platform:"YouTube"+(sched?" (Scheduled)":""),date:new Date().toISOString(),status:sched?"scheduled":"live"},...prev]);
    } catch(e){setYtProgress("Error: "+e.message);}
    setYtUploading(false);
  }

  function calcStreak() {
    let s=0;const sorted=[...history].sort((a,b)=>new Date(b.date)-new Date(a.date));
    let check=new Date();check.setHours(0,0,0,0);
    for(const p of sorted){const d=new Date(p.date);d.setHours(0,0,0,0);if(d.getTime()===check.getTime()){s++;check.setDate(check.getDate()-1);}else if(d.getTime()<check.getTime())break;}
    return s;
  }
  const streak=calcStreak();

  // ─── COMMON STYLES ────────────────────────────────────────────────────────────
  const S = {
    label: {fontSize:10,fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,color:T.onSurfaceVariant,letterSpacing:"0.12em",textTransform:"uppercase"},
    sora:  {fontFamily:"'Sora',sans-serif"},
    mono:  {fontFamily:"'JetBrains Mono',monospace"},
    page:  {padding:"16px",paddingBottom:96},
  };

  function methodColor(method) { return T[METHOD_META[method]?.colorKey||"primary"]||T.primary; }

  // ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
  function IdeaCard({idea, onSchedule}) {
    const [open,setOpen] = useState(false);
    const scheduled = scheduledTitles.includes(idea.title);
    const col = methodColor(idea.method);
    const m = METHOD_META[idea.method]||METHOD_META.ORIGINAL;
    return (
      <Glass T={T} style={{marginBottom:8,borderLeft:"3px solid "+col,opacity:scheduled?0.5:1,overflow:"hidden"}}>
        <div onClick={()=>setOpen(!open)} style={{padding:"14px 16px",cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:6}}>
                <span style={{fontSize:9,background:"rgba("+hexRgb(col)+",0.12)",color:col,border:"1px solid rgba("+hexRgb(col)+",0.25)",padding:"2px 8px",borderRadius:99,fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,letterSpacing:"0.06em"}}>{m.label}</span>
                <span style={{fontSize:9,color:T.onSurfaceVariant,fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:600}}>#{idea.niche}</span>
              </div>
              <p style={{...S.sora,fontSize:15,fontWeight:700,color:T.onSurface,lineHeight:1.3,marginBottom:3}}>{idea.title}</p>
              <p style={{fontSize:11,color:T.onSurfaceVariant,fontFamily:"'Hanken Grotesk',sans-serif",fontStyle:"italic"}}>"{idea.hook}"</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end",flexShrink:0}}>
              <Icon name={open?"expand_less":"expand_more"} size={20} color={T.outlineVariant}/>
              {!scheduled
                ? <button onClick={e=>{e.stopPropagation();onSchedule(idea);}} style={{background:T.gradBtn,color:"#fff",border:"none",borderRadius:8,padding:"5px 12px",fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,fontSize:10,cursor:"pointer",letterSpacing:"0.05em",boxShadow:T.glow}}>SCHEDULE</button>
                : <span style={{fontSize:9,...S.mono,color:T.green,fontWeight:700}}>SCHEDULED</span>}
            </div>
          </div>
        </div>
        {open&&(
          <div style={{padding:"0 16px 14px",borderTop:"1px solid "+T.outlineVariant+"33",animation:"slideUp 0.2s ease"}}>
            <p style={{fontSize:12,color:"#aaa",fontFamily:"'Hanken Grotesk',sans-serif",lineHeight:1.6,margin:"10px 0"}}>{idea.concept}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10}}>
              <div>
                <p style={{...S.label,color:T.primary,fontSize:9,marginBottom:4}}>RECORDING</p>
                {(idea.recordingFocus||[]).map((r,j)=><p key={j} style={{fontSize:11,color:"#bbb",fontFamily:"'Hanken Grotesk',sans-serif",marginBottom:3}}>• {r}</p>)}
              </div>
              <div>
                <p style={{...S.label,color:T.tertiary,fontSize:9,marginBottom:4}}>EDITING</p>
                {(idea.editingFocus||[]).map((e,j)=><p key={j} style={{fontSize:11,color:"#bbb",fontFamily:"'Hanken Grotesk',sans-serif",marginBottom:3}}>• {e}</p>)}
              </div>
            </div>
            {idea.viralMechanism&&(
              <div style={{background:"rgba("+hexRgb(T.orange)+",0.07)",border:"1px solid rgba("+hexRgb(T.orange)+",0.15)",borderRadius:8,padding:"8px 12px",display:"flex",gap:6}}>
                <Icon name="trending_up" size={14} color={T.orange} style={{marginTop:1}}/>
                <p style={{fontSize:11,color:"#ccc",fontFamily:"'Hanken Grotesk',sans-serif"}}><strong style={{color:T.orange}}>VIRAL: </strong>{idea.viralMechanism}</p>
              </div>
            )}
          </div>
        )}
      </Glass>
    );
  }

  // ─── TABS ─────────────────────────────────────────────────────────────────────

  const OverviewTab = () => (
    <div style={S.page}>
      <p style={{...S.label,marginBottom:4}}>CURRENT CYCLE</p>
      <h1 style={{...S.sora,fontSize:28,fontWeight:700,color:"#fff",marginBottom:20,letterSpacing:"-0.01em"}}>{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})} — Overview</h1>
      {/* Streak */}
      <Glass T={T} glow style={{padding:20,marginBottom:12,background:"linear-gradient(145deg,rgba("+hexRgb(T.primary)+",0.06),"+T.glass+")",border:"1px solid rgba("+hexRgb(T.primary)+",0.18)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-10,top:-10,opacity:0.04,fontSize:110,...S.sora,fontWeight:700,color:T.primary,pointerEvents:"none",lineHeight:1}}>FIRE</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",position:"relative",zIndex:1}}>
          <div>
            <p style={{...S.label,fontSize:9,marginBottom:4}}>STREAK_ENGINE</p>
            <p style={{...S.sora,fontSize:44,fontWeight:700,color:T.primary,lineHeight:1,textShadow:"0 0 20px rgba("+hexRgb(T.primary)+",0.5)"}}>{streak}<span style={{fontSize:18,marginLeft:6}}>DAYS</span></p>
          </div>
          <div style={{display:"flex",gap:3,alignItems:"flex-end",height:32}}>
            {[1,0.85,0.95,0.5,0.3].map((h,i)=>(
              <div key={i} style={{width:7,height:32*h,background:i<streak%5?T.primary:T.surfaceHighest,borderRadius:3,transition:"height 0.3s"}}/>
            ))}
          </div>
        </div>
      </Glass>
      {/* Stats bento */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
        {[
          {label:"IDEAS_READY", val:ideas.length,       icon:"lightbulb",     col:T.primary},
          {label:"SCHEDULED",   val:totalScheduled,     icon:"calendar_month",col:T.orange},
          {label:"TOTAL_POSTS", val:history.length,     icon:"publish",       col:T.tertiary},
          {label:"LEARNING",    val:slog.length,        icon:"psychology",    col:T.purple},
        ].map(s=>(
          <Glass T={T} key={s.label} style={{padding:"14px 16px"}}>
            <p style={{...S.label,fontSize:9,marginBottom:8}}>{s.label}</p>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
              <span style={{...S.sora,fontSize:26,fontWeight:700,color:T.onSurface}}>{s.val}</span>
              <Icon name={s.icon} size={20} color={s.col} fill={1}/>
            </div>
            <div style={{marginTop:8,height:3,background:T.surfaceHighest,borderRadius:4}}>
              <div style={{height:"100%",width:Math.min(100,(s.val/(Math.max(1,s.val)+3))*100)+"%",background:s.col,borderRadius:4,transition:"width 0.6s ease"}}/>
            </div>
          </Glass>
        ))}
      </div>
      {/* Today's idea */}
      {(calendar[DAYS[Math.max(0,new Date().getDay()-1)]]||[])[0]&&(
        <Glass T={T} style={{padding:"14px 16px",borderLeft:"4px solid "+T.primary,marginBottom:12,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,right:0,width:80,height:80,background:"rgba("+hexRgb(T.primary)+",0.05)",borderRadius:"50%",marginRight:-40,marginTop:-40,filter:"blur(20px)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:T.outlineVariant,display:"inline-block"}}/>
            <span style={{...S.label,fontSize:9}}>MATCHED IDEA // TODAY</span>
          </div>
          <p style={{...S.sora,fontSize:15,fontWeight:700,color:T.onSurface,marginBottom:3}}>{(calendar[DAYS[Math.max(0,new Date().getDay()-1)]]||[])[0].title}</p>
          <p style={{fontSize:12,color:T.onSurfaceVariant,fontFamily:"'Hanken Grotesk',sans-serif",lineHeight:1.5}}>{(calendar[DAYS[Math.max(0,new Date().getDay()-1)]]||[])[0].concept}</p>
        </Glass>
      )}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <RippleBtn T={T} onClick={()=>switchTab("generate")}><Icon name="lightbulb" size={16} fill={1}/>Generate Ideas</RippleBtn>
        <RippleBtn T={T} variant="outline" onClick={()=>switchTab("post")}><Icon name="publish" size={14}/>Post Pipeline</RippleBtn>
      </div>
      {!ytToken&&(
        <Glass T={T} style={{padding:16,marginTop:12,border:"1px solid rgba("+hexRgb(T.primary)+",0.2)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <Icon name="link_off" size={16} color={T.primary}/>
            <span style={{...S.label,color:T.primary,fontSize:9}}>YOUTUBE NOT CONNECTED</span>
          </div>
          <p style={{fontSize:12,color:T.onSurfaceVariant,fontFamily:"'Hanken Grotesk',sans-serif",marginBottom:10}}>Connect to enable direct upload from Pipeline.</p>
          <RippleBtn T={T} variant="outline" onClick={()=>setShowSettings(true)}>Setup YouTube</RippleBtn>
        </Glass>
      )}
    </div>
  );

  const GenerateTab = () => {
    return (
      <div style={S.page}>
        {/* Method pills */}
        <p style={{...S.label,marginBottom:8}}>SELECT METHODOLOGY</p>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:14}}>
          {["ALL","ZOINK_TWIST","NICHE_BEND","VIRAL_DECONSTRUCT","ORIGINAL"].map(m=>{
            const active=method===m;
            const col=METHOD_META[m]?T[METHOD_META[m].colorKey]:T.primary;
            return (
              <button key={m} onClick={()=>setMethod(m)} style={{
                flexShrink:0,padding:"8px 14px",borderRadius:8,
                border:active?"2px solid "+col:"1px solid "+T.outlineVariant,
                background:active?"rgba("+hexRgb(col)+",0.12)":T.surfaceLow,
                color:active?col:T.onSurfaceVariant,
                fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,fontSize:10,
                cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase",
                boxShadow:active?"0 2px 12px rgba("+hexRgb(col)+",0.2)":"none",
                transition:"all 0.15s",
              }}>{m==="ALL"?"ALL METHODS":METHOD_META[m]?.label}</button>
            );
          })}
        </div>
        {/* Slider */}
        <Glass T={T} style={{padding:16,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <p style={S.label}>BATCH QUANTITY</p>
            <span style={{...S.sora,fontSize:20,fontWeight:700,color:T.primary}}>{count}</span>
          </div>
          {/* Tap stepper — reliable on mobile */}
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            {[1,3,5,7,10,15,20].map(n=>(
              <button key={n} onClick={()=>setCount(n)} style={{
                flex:1,padding:"8px 0",borderRadius:8,border:"none",
                background:count===n?T.primary:T.surfaceHighest,
                color:count===n?"#fff":T.onSurfaceVariant,
                fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:11,
                cursor:"pointer",transition:"all 0.15s",
                boxShadow:count===n?"0 0 10px rgba("+hexRgb(T.primary)+",0.35)":"none",
              }}>{n}</button>
            ))}
          </div>
        </Glass>
        {/* Learning + trend */}
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          {slog.length>0&&(
            <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",background:"rgba("+hexRgb(T.purple)+",0.08)",border:"1px solid rgba("+hexRgb(T.purple)+",0.2)",borderRadius:99}}>
              <Icon name="psychology" size={14} color={T.purple} fill={1}/>
              <span style={{fontSize:9,fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,color:T.purple,letterSpacing:"0.08em"}}>LEARNING: {slog.length}</span>
            </div>
          )}
          <div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 10px",background:trendData?"rgba(74,222,128,0.06)":"transparent",border:"1px solid "+(trendData?"rgba(74,222,128,0.2)":T.outlineVariant+"4d"),borderRadius:99}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:trendData?T.green:trendLoading?T.orange:T.outlineVariant,display:"inline-block",animation:trendLoading?"pulse 1s infinite":undefined}}/>
            <span style={{fontSize:9,...S.mono,color:trendData?T.green:T.onSurfaceVariant}}>{trendLoading?"FETCHING...":trendData?"SYNC ACTIVE"+(trendAge?" · "+trendAge.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):""):"NO DATA"}</span>
          </div>
          {ideas.length>0&&<RippleBtn T={T} variant="outline" small onClick={autoFill}>Auto-fill Week</RippleBtn>}
        </div>
        <RippleBtn T={T} full onClick={generateIdeas} disabled={genLoading}>
          <Icon name="settings_suggest" size={18} fill={1}/>
          {genLoading?"GENERATING...":"GENERATE CONTENT ENGINE"}
        </RippleBtn>
        {genStatus&&<p style={{fontSize:11,color:T.primary,...S.mono,marginTop:8}}>{genStatus}</p>}
        {/* Feed */}
        {ideas.length>0&&(
          <div style={{borderBottom:"1px solid "+T.outlineVariant+"4d",paddingBottom:8,margin:"16px 0 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <p style={S.label}>GENERATED OUTPUT</p>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:T.primary,display:"inline-block"}}/>
              <span style={{fontSize:9,...S.mono,color:T.onSurfaceVariant}}>{ideas.length} IDEAS</span>
            </div>
          </div>
        )}
        {ideas.map((idea,i)=><IdeaCard key={i} idea={idea} onSchedule={idea=>setScheduleModal(idea)}/>)}
        {!ideas.length&&!genLoading&&(
          <div style={{textAlign:"center",padding:"60px 0",color:T.outlineVariant}}>
            <Icon name="lightbulb" size={44} color={T.outlineVariant}/>
            <p style={{...S.sora,fontSize:15,fontWeight:600,marginTop:12,color:T.onSurface}}>Hit Generate to build ideas</p>
            <p style={{fontSize:12,color:T.onSurfaceVariant,fontFamily:"'Hanken Grotesk',sans-serif",marginTop:4}}>Uses live vidIQ data + your scheduling history</p>
          </div>
        )}
      </div>
    );
  };

  const DecodeTab = () => (
    <div style={S.page}>
      <p style={{...S.label,marginBottom:4}}>VIRAL DECODER</p>
      <p style={{fontSize:13,color:T.onSurfaceVariant,fontFamily:"'Hanken Grotesk',sans-serif",lineHeight:1.6,marginBottom:14}}>Paste any viral video title, URL, or describe a trend. Claude deconstructs it and generates 3 Roblox remakes.</p>
      <Glass T={T} style={{marginBottom:12}}>
        <textarea value={decodeInput} onChange={e=>setDecodeInput(e.target.value)}
          placeholder="I Survived 100 Days in Hardcore Minecraft — or a TikTok challenge, meme format, YouTube trend..."
          rows={5}
          style={{width:"100%",background:"transparent",border:"none",color:T.onSurface,padding:"14px",fontSize:13,fontFamily:"'Hanken Grotesk',sans-serif",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
      </Glass>
      <RippleBtn T={T} onClick={decodeViral} disabled={genLoading||!decodeInput.trim()}>
        <Icon name="analytics" size={16} fill={1}/>
        {genLoading?"DECODING...":"DECODE + GENERATE"}
      </RippleBtn>
      {genStatus&&<p style={{fontSize:11,color:T.orange,...S.mono,marginTop:8}}>{genStatus}</p>}
      {/* Decoded results */}
      {ideas.filter(i=>i.method==="VIRAL_DECONSTRUCT").length>0&&(
        <div style={{marginTop:20}}>
          <div style={{borderBottom:"1px solid "+T.outlineVariant+"4d",paddingBottom:8,marginBottom:12}}><p style={S.label}>DECODED IDEAS</p></div>
          {ideas.filter(i=>i.method==="VIRAL_DECONSTRUCT").map((idea,i)=>(
            <IdeaCard key={i} idea={idea} onSchedule={idea=>setScheduleModal(idea)}/>
          ))}
        </div>
      )}
    </div>
  );

  const CalendarTab = () => (
    <div style={S.page}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div>
          <p style={{...S.label,marginBottom:2}}>CURRENT CYCLE</p>
          <p style={{...S.sora,fontSize:22,fontWeight:700,color:"#fff"}}>{totalScheduled}/7 Filled</p>
        </div>
        <div style={{display:"flex",gap:6}}>
          {ideas.length>0&&<button onClick={autoFill} style={{background:"transparent",border:"1px solid "+T.outlineVariant,color:T.primary,borderRadius:8,padding:"6px 12px",fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",gap:4,letterSpacing:"0.06em"}}>
            <Icon name="bolt" size={13} fill={1} color={T.primary}/>AUTO-FILL
          </button>}
          <RippleBtn T={T} variant="outline" small onClick={()=>setCalendar({})}>Clear</RippleBtn>
        </div>
      </div>
      {DAYS.map((day,di)=>{
        const dayIdeas=calendar[day]||[];
        const today=DAYS[Math.max(0,new Date().getDay()-1)]===day;
        const dateNum=new Date(new Date().setDate(new Date().getDate()-Math.max(0,new Date().getDay()-1)+di)).getDate();
        return (
          <div key={day} style={{display:"flex",gap:12,marginBottom:14}}>
            <div style={{width:44,flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",paddingTop:8}}>
              <span style={{fontSize:10,fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,color:T.onSurfaceVariant,letterSpacing:"0.1em"}}>{day.toUpperCase()}</span>
              <span style={{...S.sora,fontSize:20,fontWeight:700,color:today?T.primary:"#fff"}}>{dateNum}</span>
            </div>
            <div style={{flex:1}}>
              {dayIdeas.map((idea,i)=>{
                const col=methodColor(idea.method);
                const m=METHOD_META[idea.method]||METHOD_META.ORIGINAL;
                return (
                  <Glass T={T} key={i} style={{padding:"12px 14px",marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1}}>
                        <span style={{fontSize:9,color:col,background:"rgba("+hexRgb(col)+",0.1)",border:"1px solid rgba("+hexRgb(col)+",0.2)",padding:"1px 7px",borderRadius:99,fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,display:"inline-block",marginBottom:5}}>{m.label}</span>
                        <p style={{...S.sora,fontSize:14,fontWeight:700,color:T.onSurface,lineHeight:1.3}}>{idea.title}</p>
                      </div>
                      <button onClick={()=>removeFromCal(day,i)} style={{background:"none",border:"none",color:T.outlineVariant,cursor:"pointer",padding:4}}><Icon name="close" size={15} color={T.outlineVariant}/></button>
                    </div>
                  </Glass>
                );
              })}
              {!dayIdeas.length&&(
                <button onClick={()=>{if(ideas.length){const u=ideas.find(i=>!scheduledTitles.includes(i.title));if(u)scheduleIdea(u,day);}}} style={{width:"100%",height:64,border:"2px dashed "+T.outlineVariant+"44",borderRadius:8,background:"transparent",color:T.outlineVariant,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}>
                  <Icon name="add" size={18} color={T.outlineVariant}/>
                  <span style={{fontSize:8,fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase"}}>EMPTY</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const PostTab = () => (
    <div style={S.page}>
      <p style={{...S.sora,fontSize:26,fontWeight:700,color:"#fff",marginBottom:4,letterSpacing:"-0.01em",textTransform:"uppercase"}}>Pipeline</p>
      <div style={{width:48,height:4,background:T.primary,borderRadius:99,marginBottom:20}}/>
      {/* Drop zone */}
      <div
        onDragOver={e=>e.preventDefault()}
        onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f?.type.startsWith("video/"))setVideoFile(f);}}
        onClick={()=>document.getElementById("vid-input").click()}
        style={{border:"2px dashed "+(videoFile?T.green:T.outlineVariant),borderRadius:10,padding:"28px 16px",textAlign:"center",cursor:"pointer",background:videoFile?"rgba(74,222,128,0.03)":T.surfaceLow,transition:"all 0.3s",marginBottom:12}}>
        <div style={{width:60,height:60,background:T.surfaceHigh,border:"1px solid "+T.outlineVariant,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",transition:"all 0.3s"}}>
          <Icon name={videoFile?"check_circle":"upload_file"} size={26} color={videoFile?T.green:T.onSurfaceVariant} fill={videoFile?1:0}/>
        </div>
        <p style={{...S.label,marginBottom:3}}>{videoFile?videoFile.name:"UPLOAD VIDEO"}</p>
        <p style={{fontSize:12,color:T.outline,fontFamily:"'Hanken Grotesk',sans-serif"}}>{videoFile?(videoFile.size/1024/1024).toFixed(1)+" MB":"Drag and drop or browse files"}</p>
        <button onClick={e=>{e.stopPropagation();document.getElementById("vid-input").click();}} style={{marginTop:10,display:"flex",alignItems:"center",gap:6,background:T.surfaceHighest,border:"1px solid "+T.outlineVariant,padding:"8px 16px",borderRadius:8,cursor:"pointer",fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,fontSize:11,color:T.onSurface,margin:"10px auto 0"}}>
          <Icon name="photo_camera" size={14}/>Camera Roll
        </button>
        <input id="vid-input" type="file" accept="video/*,video/mp4,video/quicktime" capture="environment" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)setVideoFile(f);}}/>
      </div>
      {videoFile&&<button onClick={()=>setVideoFile(null)} style={{fontSize:10,color:T.outline,background:"none",border:"none",cursor:"pointer",fontFamily:"'Hanken Grotesk',sans-serif",marginBottom:10}}>Remove</button>}
      {/* Link */}
      <p style={{...S.label,marginBottom:5,fontSize:9}}>OR DRIVE / DROPBOX LINK</p>
      <input value={videoLink} onChange={e=>setVideoLink(e.target.value)} placeholder="https://drive.google.com/..." style={{width:"100%",background:T.surfaceLow,border:"1px solid "+T.outlineVariant,borderRadius:8,color:T.onSurface,padding:"10px 12px",fontSize:13,fontFamily:"'Hanken Grotesk',sans-serif",outline:"none",boxSizing:"border-box",marginBottom:12}}/>
      {/* Notes */}
      <p style={{...S.label,marginBottom:5,fontSize:9}}>CREATOR NOTES</p>
      <textarea value={videoNotes} onChange={e=>setVideoNotes(e.target.value)} placeholder="Key moments to highlight..." rows={2} style={{width:"100%",background:T.surfaceLow,border:"1px solid "+T.outlineVariant,borderRadius:8,color:T.onSurface,padding:"10px 12px",fontSize:13,fontFamily:"'Hanken Grotesk',sans-serif",outline:"none",resize:"vertical",boxSizing:"border-box",marginBottom:10}}/>
      {/* Custom title override */}
      <p style={{...S.label,marginBottom:5,fontSize:9}}>CUSTOM TITLE <span style={{color:T.outlineVariant,fontWeight:400,textTransform:"none",fontSize:9,letterSpacing:0}}>(optional — overrides AI suggestion)</span></p>
      <input value={customTitle} onChange={e=>setCustomTitle(e.target.value)} placeholder="Leave blank to let Claude write it..." style={{width:"100%",background:T.surfaceLow,border:"1px solid "+T.outlineVariant,borderRadius:8,color:T.onSurface,padding:"10px 12px",fontSize:13,fontFamily:"'Hanken Grotesk',sans-serif",outline:"none",boxSizing:"border-box",marginBottom:10}}/>
      {/* Custom tags */}
      <p style={{...S.label,marginBottom:5,fontSize:9}}>EXTRA TAGS <span style={{color:T.outlineVariant,fontWeight:400,textTransform:"none",fontSize:9,letterSpacing:0}}>(comma separated)</span></p>
      <input value={customTags} onChange={e=>setCustomTags(e.target.value)} placeholder="roblox, shorts, luckyblock..." style={{width:"100%",background:T.surfaceLow,border:"1px solid "+T.outlineVariant,borderRadius:8,color:T.onSurface,padding:"10px 12px",fontSize:13,fontFamily:"'Hanken Grotesk',sans-serif",outline:"none",boxSizing:"border-box",marginBottom:14}}/>
      {/* Matched idea */}
      {(calendar[postDay]||[])[0]&&(
        <Glass T={T} style={{padding:"12px 14px",borderLeft:"4px solid "+T.primary,marginBottom:14,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,right:0,width:60,height:60,background:"rgba("+hexRgb(T.primary)+",0.05)",borderRadius:"50%",marginRight:-30,marginTop:-30,filter:"blur(15px)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:T.outlineVariant,display:"inline-block"}}/>
            <span style={{...S.label,fontSize:9}}>MATCHED IDEA // {postDay.toUpperCase()}</span>
          </div>
          <p style={{...S.sora,fontSize:15,fontWeight:700,color:T.onSurface,marginBottom:3}}>{(calendar[postDay]||[])[0].title}</p>
          <div style={{display:"flex",gap:12,marginTop:5}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}><Icon name="calendar_today" size={13} color={T.primary}/><span style={{fontSize:11,color:T.outline,fontFamily:"'Hanken Grotesk',sans-serif"}}>{postDay}</span></div>
            <div style={{display:"flex",alignItems:"center",gap:4}}><Icon name="timer" size={13} color={T.primary}/><span style={{fontSize:11,color:T.outline,fontFamily:"'Hanken Grotesk',sans-serif"}}>{postTime}</span></div>
          </div>
        </Glass>
      )}
      {/* Day/time/schedule */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        <div>
          <p style={{...S.label,fontSize:9,marginBottom:4}}>DAY</p>
          <select value={postDay} onChange={e=>setPostDay(e.target.value)} style={{width:"100%",background:T.surfaceLow,border:"1px solid "+T.outlineVariant,borderRadius:8,color:T.onSurface,padding:"8px 10px",fontSize:12,fontFamily:"'Hanken Grotesk',sans-serif"}}>
            {DAYS.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <p style={{...S.label,fontSize:9,marginBottom:4}}>TIME</p>
          <input type="time" value={postTime} onChange={e=>setPostTime(e.target.value)} style={{width:"100%",background:T.surfaceLow,border:"1px solid "+T.outlineVariant,borderRadius:8,color:T.onSurface,padding:"8px 10px",fontSize:12,fontFamily:"'Hanken Grotesk',sans-serif",boxSizing:"border-box"}}/>
        </div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {["now","scheduled"].map(s=>(
          <button key={s} onClick={()=>setPostSchedule(s)} style={{flex:1,padding:"10px",borderRadius:8,border:postSchedule===s?"1px solid "+T.primary:"1px solid "+T.outlineVariant,background:postSchedule===s?"rgba("+hexRgb(T.primary)+",0.08)":"transparent",color:postSchedule===s?T.primary:T.onSurfaceVariant,fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,fontSize:10,cursor:"pointer",letterSpacing:"0.06em",textTransform:"uppercase"}}>{s==="now"?"POST NOW":"SCHEDULE"}</button>
        ))}
      </div>
      <RippleBtn T={T} full onClick={generateKits} disabled={kitLoading||(!videoFile&&!videoLink)}>
        <Icon name="auto_awesome" size={16} fill={1}/>
        {kitLoading?"BUILDING KITS...":"GENERATE METADATA KITS"}
      </RippleBtn>
      {kitStatus&&<p style={{fontSize:11,color:T.orange,...S.mono,marginTop:8}}>{kitStatus}</p>}
      {/* Kits */}
      {kits&&(
        <div style={{marginTop:20}}>
          <p style={{...S.label,marginBottom:10}}>PLATFORM KITS</p>
          {["youtube","tiktok","instagram"].map(p=>(
            <PlatformKit key={p} p={p} T={T} S={S} kits={kits} setKits={setKits} copiedPlat={copiedPlat} copyKit={copyKit}/>
          ))}
          {/* YT Upload */}
          <div style={{marginTop:14}}>
            <p style={{...S.label,marginBottom:10}}>YOUTUBE AUTO-POST</p>
            {!ytToken?(
              <Glass T={T} style={{padding:16,border:"1px solid rgba("+hexRgb(T.primary)+",0.2)"}}>
                <p style={{fontSize:12,color:T.onSurfaceVariant,fontFamily:"'Hanken Grotesk',sans-serif",marginBottom:10}}>Connect your YouTube channel to upload directly.</p>
                <RippleBtn T={T} onClick={()=>{if(!ytClientId)setShowSettings(true);else window.location.href=ytAuthURL(ytClientId);}}>
                  <Icon name="link" size={15}/>Connect YouTube
                </RippleBtn>
              </Glass>
            ):(
              <Glass T={T} style={{padding:16,border:"1px solid rgba(74,222,128,0.2)"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                  <Icon name="check_circle" size={15} color={T.green} fill={1}/>
                  <span style={{fontSize:10,...S.mono,color:T.green,fontWeight:700}}>CONNECTED</span>
                </div>
                {!videoFile&&<p style={{fontSize:10,color:T.orange,fontFamily:"'Hanken Grotesk',sans-serif",marginBottom:8}}>File required for YouTube upload</p>}
                <RippleBtn T={T} onClick={postToYT} disabled={ytUploading||!videoFile}>
                  <Icon name="rocket_launch" size={15} fill={1}/>
                  {ytUploading?"UPLOADING...":postSchedule==="scheduled"?"SCHEDULE FOR "+postDay+" "+postTime:"UPLOAD NOW"}
                </RippleBtn>
                {ytProgress&&<p style={{fontSize:11,...S.mono,marginTop:8,color:ytProgress.startsWith("Live")?T.green:ytProgress.startsWith("Error")?T.primary:T.orange}}>{ytProgress}</p>}
              </Glass>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const HistoryTab = () => (
    <div style={S.page}>
      <Glass T={T} glow style={{padding:20,marginBottom:12,background:"rgba("+hexRgb(T.primary)+",0.04)",border:"1px solid rgba("+hexRgb(T.primary)+",0.15)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:12,top:12,opacity:0.05,pointerEvents:"none"}}>
          <Icon name="bolt" size={72} color={T.primary}/>
        </div>
        <p style={{...S.label,fontSize:9,marginBottom:4}}>STREAK_ENGINE_STATUS</p>
        <p style={{...S.sora,fontSize:40,fontWeight:700,color:T.primary,lineHeight:1,textShadow:"0 0 20px rgba("+hexRgb(T.primary)+",0.5)"}}>{streak} <span style={{fontSize:18}}>DAYS</span></p>
      </Glass>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:14}}>
        {[{l:"TOTAL",v:history.length,c:T.onSurface},{l:"LIVE",v:history.filter(p=>p.status==="live").length,c:T.green},{l:"QUEUED",v:history.filter(p=>p.status==="scheduled").length,c:T.orange}].map(s=>(
          <Glass T={T} key={s.l} style={{padding:"12px"}}>
            <p style={{...S.label,fontSize:8,marginBottom:6}}>{s.l}</p>
            <p style={{...S.sora,fontSize:22,fontWeight:700,color:s.c}}>{s.v}</p>
          </Glass>
        ))}
      </div>
      <div style={{borderBottom:"1px solid "+T.outlineVariant+"4d",paddingBottom:8,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <p style={S.label}>POST LOG</p>
        {history.length>0&&<button onClick={()=>{if(confirm("Clear all history?"))setHistory([]);}} style={{background:"none",border:"none",color:T.outlineVariant,cursor:"pointer",fontSize:10,fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,letterSpacing:"0.05em"}}>CLEAR</button>}
      </div>
      {history.length?history.map(p=>(
        <Glass T={T} key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",marginBottom:6}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:p.status==="live"?T.green:p.status==="scheduled"?T.orange:T.outline,flexShrink:0,boxShadow:p.status==="live"?"0 0 8px "+T.green:undefined}}/>
          <div style={{flex:1,minWidth:0}}>
            <p style={{...S.sora,fontSize:13,fontWeight:700,color:T.onSurface,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.title}</p>
            <p style={{fontSize:10,color:T.outline,fontFamily:"'Hanken Grotesk',sans-serif",marginTop:1}}>{new Date(p.date).toLocaleDateString()} · {p.platform}</p>
          </div>
          <div style={{flexShrink:0,textAlign:"right"}}>
            {p.ytId&&<a href={"https://youtube.com/watch?v="+p.ytId} target="_blank" rel="noreferrer" style={{fontSize:9,...S.mono,color:T.primary,textDecoration:"none",display:"block"}}>VIEW</a>}
            <p style={{fontSize:9,...S.mono,color:p.status==="live"?T.green:p.status==="scheduled"?T.orange:T.outline,fontWeight:700}}>{p.status.toUpperCase()}</p>
          </div>
        </Glass>
      )):(
        <div style={{textAlign:"center",padding:"60px 0"}}>
          <Icon name="history" size={44} color={T.outlineVariant}/>
          <p style={{...S.sora,fontSize:15,fontWeight:600,color:T.onSurface,marginTop:12}}>Post history appears here</p>
        </div>
      )}
    </div>
  );

  // ─── NAV ──────────────────────────────────────────────────────────────────────
  const NAV = [
    {id:"overview",  icon:"home",          label:"Home"},
    {id:"generate",  icon:"lightbulb",     label:"Ideas"},
    {id:"decode",    icon:"analytics",     label:"Decode"},
    {id:"calendar",  icon:"calendar_month",label:"Plan"},
    {id:"post",      icon:"publish",       label:"Pipeline"},
    {id:"history",   icon:"history",       label:"History"},
  ];

  const TABS_MAP = {overview:<OverviewTab/>,generate:<GenerateTab/>,decode:<DecodeTab/>,calendar:<CalendarTab/>,post:<PostTab/>,history:<HistoryTab/>};

  return (
    <div style={{minHeight:"100vh",background:T.bg,color:T.onSurface,fontFamily:"'Hanken Grotesk',sans-serif"}}>
      <GlobalStyles primary={T.primary}/>
      {/* HEADER — liquid glass */}
      <header style={{
        position:"fixed",top:0,left:0,width:"100%",zIndex:50,height:60,
        display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 16px",
        background:T.glass, backdropFilter:T.glassBlur, WebkitBackdropFilter:T.glassBlur,
        borderBottom:"1px solid "+T.glassBorder, boxSizing:"border-box",
        boxShadow:"inset 0 1px 0 rgba(255,255,255,0.05)",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:8,background:"rgba("+hexRgb(T.primary)+",0.12)",border:"1px solid rgba("+hexRgb(T.primary)+",0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon name="local_fire_department" size={18} color={T.primary} fill={1}/>
          </div>
          <span style={{...S.sora,fontSize:17,fontWeight:700,color:"#fff",letterSpacing:"-0.01em"}}>
            OPS_<span style={{color:T.primary}}>CORE</span>
          </span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:9,...S.mono,color:ytToken?T.green:T.outlineVariant}}>{ytToken?"YT LIVE":"YT OFFLINE"}</span>
          <button onClick={()=>setShowSettings(true)} style={{
            width:34,height:34,borderRadius:8,
            background:T.glass, backdropFilter:T.glassBlur,
            border:"1px solid "+T.glassBorder,
            display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
          }}>
            <Icon name="settings" size={17} color={T.onSurfaceVariant}/>
          </button>
        </div>
      </header>

      {/* CONTENT with liquid-in animation */}
      <main style={{paddingTop:60,paddingBottom:72}}>
        <div key={tabKey} className="tab-enter">
          {TABS_MAP[tab]}
        </div>
      </main>

      {/* BOTTOM NAV — liquid glass */}
      <nav style={{
        position:"fixed",bottom:0,left:0,width:"100%",zIndex:50,height:72,
        display:"flex",justifyContent:"space-around",alignItems:"center",
        background:T.glass, backdropFilter:T.glassBlur, WebkitBackdropFilter:T.glassBlur,
        borderTop:"1px solid "+T.glassBorder,
        boxShadow:"inset 0 1px 0 rgba(255,255,255,0.07), 0 -8px 32px rgba(0,0,0,0.4)",
        boxSizing:"border-box", padding:"0 4px 4px",
      }}>
        {NAV.map((t)=>{
          const active=tab===t.id;
          return (
            <button key={t.id} onClick={()=>switchTab(t.id)} style={{
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              background:"transparent",border:"none",cursor:"pointer",flex:1,height:"100%",
              padding:"4px 0 2px",position:"relative",WebkitTapHighlightColor:"transparent",
              outline:"none",
            }}>
              {/* Glow line at top */}
              <div style={{
                position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",
                width:active?28:0,height:2,background:T.primary,borderRadius:99,
                transition:"width 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow:active?"0 0 8px "+T.primary:"none",
              }}/>
              {/* Pill wraps icon+label */}
              <div style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:2,
                padding:"5px 10px 4px",borderRadius:12,
                background:active?"rgba("+hexRgb(T.primary)+",0.12)":"transparent",
                backdropFilter:active?"blur(12px)":"none",
                border:active?"1px solid rgba("+hexRgb(T.primary)+",0.22)":"1px solid transparent",
                boxShadow:active?"0 0 12px rgba("+hexRgb(T.primary)+",0.15), inset 0 1px 0 rgba(255,255,255,0.08)":"none",
                transform:active?"translateY(-1px)":"translateY(0)",
                transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                animation:active?"navPop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards":undefined,
              }}>
                <Icon name={t.icon} size={20} color={active?T.primary:T.onSurfaceVariant} fill={active?1:0}/>
                <span style={{
                  fontSize:8,fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,
                  color:active?T.primary:T.onSurfaceVariant,
                  letterSpacing:"0.05em",textTransform:"uppercase",
                  transition:"color 0.2s",lineHeight:1,
                }}>{t.label}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* SCHEDULE MODAL */}
      {scheduleModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,padding:16}} onClick={()=>setScheduleModal(null)}>
          <div style={{
            background:T.glass, backdropFilter:T.glassBlur, WebkitBackdropFilter:T.glassBlur,
            border:"1px solid "+T.glassBorder, borderRadius:16, width:"100%", maxWidth:400, padding:24,
            boxShadow:T.glow, animation:"slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }} onClick={e=>e.stopPropagation()}>
            <p style={{...S.sora,fontSize:15,fontWeight:700,color:T.onSurface,marginBottom:3}}>{scheduleModal.title}</p>
            <p style={{fontSize:11,color:T.outline,fontFamily:"'Hanken Grotesk',sans-serif",marginBottom:16}}>Pick a day</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
              {DAYS.map(day=>{
                const taken=(calendar[day]||[]).length>0;
                return (
                  <button key={day} onClick={()=>scheduleIdea(scheduleModal,day)} style={{
                    padding:"10px 4px",borderRadius:8,
                    border:taken?"1px solid "+T.outlineVariant:"1px solid rgba("+hexRgb(T.primary)+",0.4)",
                    background:taken?"transparent":"rgba("+hexRgb(T.primary)+",0.07)",
                    color:taken?T.outlineVariant:T.primary,
                    fontSize:11,fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,cursor:"pointer",
                  }}>
                    {day}{taken&&<div style={{fontSize:7,color:T.outlineVariant}}>taken</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettings&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,padding:16}} onClick={()=>setShowSettings(false)}>
          <div style={{
            background:T.glass, backdropFilter:T.glassBlur, WebkitBackdropFilter:T.glassBlur,
            border:"1px solid "+T.glassBorder, borderRadius:16, width:"100%", maxWidth:400, padding:24,
            animation:"slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }} onClick={e=>e.stopPropagation()}>
            <p style={{...S.sora,fontSize:20,fontWeight:700,color:T.onSurface,marginBottom:20}}>Settings</p>

            {/* THEME PICKER */}
            <p style={{...S.label,marginBottom:10}}>UI THEME</p>
            <div style={{display:"flex",gap:8,marginBottom:20}}>
              {Object.entries(THEMES).map(([key,theme])=>{
                const active=themeKey===key;
                return (
                  <div key={key} onClick={()=>setThemeKey(key)} style={{
                    flex:1, padding:"12px 8px", borderRadius:10, cursor:"pointer", textAlign:"center",
                    border:"2px solid "+(active?theme.primary:T.outlineVariant),
                    background:active?"rgba("+hexRgb(theme.primary)+",0.08)":T.surfaceLow,
                    boxShadow:active?theme.glow:"none",
                    transition:"all 0.2s",
                  }}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:theme.primary,margin:"0 auto 6px",boxShadow:"0 0 10px rgba("+hexRgb(theme.primary)+",0.4)"}}/>
                    <span style={{fontSize:9,fontFamily:"'Hanken Grotesk',sans-serif",fontWeight:700,color:active?theme.primary:T.onSurfaceVariant,letterSpacing:"0.05em"}}>{theme.name}</span>
                  </div>
                );
              })}
            </div>

            {/* YT CLIENT ID */}
            <p style={{...S.label,marginBottom:6}}>YOUTUBE CLIENT ID</p>
            <p style={{fontSize:10,color:T.outline,fontFamily:"'Hanken Grotesk',sans-serif",marginBottom:8,lineHeight:1.6}}>
              Get from <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{color:T.primary}}>console.cloud.google.com</a> → Enable YouTube Data API v3 → OAuth 2.0 credentials. Add <code style={{background:T.surfaceHigh,padding:"1px 4px",borderRadius:3,fontSize:9}}>{window.location.origin}</code> as authorized origin.
            </p>
            <input value={ytClientId} onChange={e=>setYtClientId(e.target.value)} placeholder="xxxx.apps.googleusercontent.com"
              style={{width:"100%",background:T.surfaceLow,border:"1px solid "+T.outlineVariant,borderRadius:8,color:T.onSurface,padding:"10px 12px",fontSize:12,fontFamily:"'Hanken Grotesk',sans-serif",outline:"none",boxSizing:"border-box",marginBottom:14}}/>

            <div style={{display:"flex",gap:8}}>
              <RippleBtn T={T} onClick={()=>{if(ytClientId){window.location.href=ytAuthURL(ytClientId);}setShowSettings(false);}}>
                <Icon name="link" size={14}/>{ytClientId?"Connect YouTube":"Save"}
              </RippleBtn>
              <RippleBtn T={T} variant="outline" onClick={()=>setShowSettings(false)}>Cancel</RippleBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
