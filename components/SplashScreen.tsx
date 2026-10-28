"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./SplashScreen.module.css";
interface SplashScreenProps { onComplete:()=>void; onLift?:()=>void }
export default function SplashScreen({onComplete,onLift}:SplashScreenProps){
 const [leaving,setLeaving]=useState(false);const callbacks=useRef({onComplete,onLift});callbacks.current={onComplete,onLift};const done=useRef(false);
 function complete(){if(done.current)return;done.current=true;callbacks.current.onLift?.();callbacks.current.onComplete();}
 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{if(e.key==="Escape"||e.key==="Enter")complete();};
  const lift=setTimeout(()=>{setLeaving(true);callbacks.current.onLift?.();},1650);
  const finish=setTimeout(complete,1950);
  window.addEventListener("keydown",key);
  return()=>{clearTimeout(lift);clearTimeout(finish);window.removeEventListener("keydown",key);};
 },[]);
 return <div data-splash-screen className={`${styles.splash} ${leaving?styles.lift:""}`} aria-label="BINDY introduction">
  <div className={styles.logoWrap} aria-hidden="true"><div className={styles.wordmark}><span>bindy</span><span className={styles.period}>.</span>{[1,2,3,4].map((n)=><span key={n} className={styles.button} style={{animationDelay:`${(n-1)*110}ms`}}><img src={`/images/splash/button-${n}.webp`} width="58" height="58" alt="" decoding="async"/></span>)}</div><div className={styles.subline}>clothing</div><p className={styles.tagline}>Two Islands. One Thread.</p></div>
  <button type="button" className={styles.skip} onClick={complete}>Skip intro</button><div className={styles.origin}>Designed in Australia <span>·</span> Inspired by Sri Lanka</div>
 </div>;
}
