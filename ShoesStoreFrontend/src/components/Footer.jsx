import "../styles/Footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-block">
          <h3>VELORA</h3>
          <p>Інтернет-магазин якісного взуття</p>
        </div>
        <div className="footer-block">
          <h4>Інформація</h4>
          <ul>
            <li>Про нас</li>
            <li>Доставка</li>
            <li>Оплата</li>
            <li>Повернення</li>
          </ul>
        </div>
        <div className="footer-block">
          <h4>Контакти</h4>
          <ul>
            <li>+380 (98) 123 3045</li>
            <li>support@gmail.com</li>
            <li>Україна</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} VELORA. Всі права захищені.
      </div>
    </footer>
  );
}