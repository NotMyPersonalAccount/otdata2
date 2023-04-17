import ReactModal from "react-modal";

type Props = ReactModal.Props & {
	title: string;
};

export default function Modal({ title, ...props }: Props) {
	return (
		<ReactModal
			className="bg-white px-8 py-8 outline-none border-t-2 sm:border-2 border-slate-200 shadow-md rounded-lg w-full sm:w-3/4 fixed sm:top-1/2 sm:left-1/2 bottom-0 sm:bottom-auto right-auto sm:-translate-x-2/4 sm:-translate-y-2/4"
			{...props}
		>
			<h1 className="text-3xl font-bold mb-4">{title}</h1>
			{props.children}
		</ReactModal>
	);
}

ReactModal.setAppElement("#__next");

