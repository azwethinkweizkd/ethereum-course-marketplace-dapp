import { useEffect, useMemo, useRef } from "react";
import ethereumApiFactory from "../../../ethereum/ethereumApiFactory";

export default function useEthereum() {
	const ethereumApi = useRef({});
	const memoizedEthereumApi = useMemo(() => ethereumApi, [ethereumApi]);
	useEffect(() => {
		if (!window || !window.ethereum) return;
		ethereumApi.current = ethereumApiFactory(window.ethereum);
	}, [ethereumApi]);

	return memoizedEthereumApi;
}
