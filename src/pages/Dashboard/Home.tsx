import PageMeta from "../../components/common/PageMeta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTicketAlt, 
  faCheckCircle, 
  faClock, 
  faExclamationTriangle,
  faUsers, 
  faCogs, 
  faCode, 
  faTerminal, 
  faPlus, 
  faUser,
  faDatabase
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard de Tickets"
        description="Panel de control y gestión de soporte técnico."
      />
    </>
  );
}