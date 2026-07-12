import styles from './CustomDropdown.module.css';
import { useState } from 'react';
import { useResponsive } from '../../hooks/ResponsiveContext.tsx';

export default function CustomDropdown({children, home = false, margin = "0px", bold = null}: any) {
    const [open, setOpen] = useState(false);

    const {isMobile} = useResponsive();

    return (
        <div 
            style={{
                display: 'flex', flexDirection: 'column', width: isMobile ? '50px' : '70px', backgroundColor: 'rgb(90, 210, 216)', color: 'black',
                fontSize: '16px', border: 'none', position: 'relative', animation: 'fadeIn 0.5s', borderRadius: '0px', cursor: 'pointer',
                ...(home ? {borderTopRightRadius: '10px', borderBottomRightRadius: '10px'} : {borderRadius: '10px'}),
                margin,
            }} 
            tabIndex={0}
            onBlur={(e) => {
                const parent = e.currentTarget;

                if (parent.contains(e.relatedTarget)) {
                    return;
                }

                //const child: HTMLInputElement = parent.querySelector(`.${styles.buttonContent}`)!;
                                
                setOpen(false);                                      
            }}
            onClick={(e) => {
                //const child: HTMLInputElement = e.currentTarget.querySelector(`.${styles.buttonContent}`)!;                  
                
                setOpen(!open);
            }}
            >
                <div 
                    className={styles.buttonText}
                    style={{
                        ...(home ? {borderTopRightRadius: '10px', borderBottomRightRadius: '10px'} : {borderRadius: '10px'}),
                        ...(bold ? {fontWeight: bold} : {}),
                    }}
                >
                    Sort</div>

                {open && <div 
                    className={styles.buttonContent}                    
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>}
            </div>
    );
};