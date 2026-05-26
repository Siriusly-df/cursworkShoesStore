import RegistrationForm from "../components/RegistrationForm";

const RegistrationPage = () => {
  return (
    <div className="registration-page">
      <div className="registration-info">
        <h1>Створіть акаунт</h1>

        <p>
          Зареєструйтесь, щоб отримати доступ до всіх можливостей магазину
          та швидко оформлювати замовлення.
        </p>

        <ul>
          <li>Швидке оформлення замовлень</li>
          <li>Історія покупок в особистому кабінеті</li>
          <li>Відстеження статусу замовлення</li>
        </ul>
      </div>
      <RegistrationForm />
    </div>
  );
};

export default RegistrationPage;