import { type Ticket } from '~/@types';

interface Props {
  ticket: Ticket;
}

export const TicketCard: React.FC<Props> = ({ ticket: { title, price } }) => {
  return (
    <div className="flex flex-col items-center justify-start">
      <h2>{title}</h2>
      <div className="flex flex-row justify-between">
        <span>${price}</span>
      </div>
    </div>
  );
};
