import ReactModal from "react-modal";

type Props = ReactModal.Props & {
	title: string;
};

export default function Modal({ title, ...props }: Props) {
	return (
		<ReactModal
			className={{
				base: "modal",
				afterOpen: "modal-open",
				beforeClose: "modal-close"
			}}
			closeTimeoutMS={200}
			{...props}
		>
			<h1 className="text-3xl font-bold mb-4">{title}</h1>
			{props.children}
		</ReactModal>
	);
}

ReactModal.setAppElement("#__next");

