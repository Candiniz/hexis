import styles from './Footer.module.css'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footer_inside}>
                <ul className={styles.social_list}>
                    <li><FaGithub /></li>
                    <li><FaLinkedin /></li>
                </ul>
                <p className={styles.copyright}><span>HEXIS</span> &copy; | Candiniz 2024</p>
            </div>
        </footer>
    )
}

export default Footer