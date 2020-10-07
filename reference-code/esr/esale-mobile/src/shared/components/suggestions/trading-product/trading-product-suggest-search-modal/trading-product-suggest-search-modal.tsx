import { TradingProductSuggest } from "../../interface/trading-product-suggest-interface";
import { ISearchCondition } from "../trading-product-search-detail/search-detail-interface";
import React, { useState, useRef, useEffect } from "react";
import { TEXT_EMPTY } from "../../../../../config/constants/constants";
import { Animated, PanResponder, ActivityIndicator, View, TouchableOpacity, TextInput, Text, FlatList, RefreshControl } from "react-native";
import { TypeSelectSuggest } from "../../../../../config/constants/enum";
import TradingProductSuggestSearchStyles from "./trading-product-suggest-search-style";
import { Icon } from "../../../icon";
import { messages } from "../trading-product-suggest-messages";
import { translate } from "../../../../../config/i18n";
import _ from "lodash";
import { saveTradingProductSuggestionsChoice, GetTradingProductSuggestion } from "../../repository/trading-product-suggest-repositoty";
import { INDEX_CHOICE, LIMIT } from "../trading-product-contants";
import { useDebounce } from "../../../../../config/utils/debounce";
import StringUtils from "../../../../util/string-utils";
import { useSelector } from "react-redux";
import { authorizationSelector } from "../../../../../modules/login/authorization/authorization-selector";

/**
 * TradingProductSuggestSearchModalProps
 */
export interface TradingProductSuggestSearchModalProps {
	fieldLabel: string,
	typeSearch: number,
	dataSelected: TradingProductSuggest[],
	isRelation?: boolean,
	currencyUnit: string
	isCloseDetailSearchModal: boolean,
	customerIds: any[]
	setConditions: (cond: ISearchCondition[]) => void;
	selectedData: (TradingProduct: TradingProductSuggest, typeSearch: number) => void;
	closeModal: () => void;
	openDetailSearchModal: () => void;
	exportError: (err: any) => void;
}

/**
 * TradingProductSuggestSearchModal component
 * @param props 
 */
export function TradingProductSuggestSearchModal(props: TradingProductSuggestSearchModalProps) {
	const authorizationState = useSelector(authorizationSelector);
	const [resultSearch, setResultSearch] = useState<TradingProductSuggest[]>([]);
	const [isErrorCallAPI, setIsErrorCallAPI] = useState(false);
	const [searchValue, setSearchValue] = useState(TEXT_EMPTY);
	const [footerIndicator, setFooterIndicator] = useState(true);
	const [refreshData, setRefreshData] = useState(false);
	const [isNoData, setIsNoData] = useState(false);
	const [offset, setOffset] = useState(0);
	const [y, setY] = useState(0);
	const debounceSearch = useDebounce(searchValue, 500);
	const pan = useRef(new Animated.ValueXY()).current;
	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: (_event, gestureState) => {
				setY(gestureState.dy);
			},
			onPanResponderRelease: () => {
				pan.flattenOffset();
			}
		})
	).current;

	/**
	 * Change value search
	 */
	useEffect(() => {
		if (debounceSearch) {
			handleSearch(searchValue, 0);
		} else {
			handleSearch(TEXT_EMPTY, 0);
		}
	}, [debounceSearch]);

	/**
	 * handle text input to show suggestion
	 * @param text text from input
	 * @param offset start index search
	 */
	const handleSearch = async (text: string, offset: number) => {
		setOffset(offset);
		setIsNoData(true);
		// Call api get suggest TradingProduct
		const payload = {
			searchValue: text,
			offset: offset,
			customerIds: props.customerIds,
			listIdChoice: props.typeSearch === TypeSelectSuggest.MULTI ? _.map(props.dataSelected, item => item.productTradingId) : []
		};
		const response = await GetTradingProductSuggestion(payload);
		if (response.status === 200 && response.data) {
			console.log('productTradings aaaaaaaaaaaaa', response.data.productTradings)
			if (offset > 0) {
				setResultSearch(resultSearch.concat(response.data.productTradings));
			} else {
				setResultSearch(response.data.productTradings);
			}
			if (!_.isEmpty(response.data.productTradings)) {
				setIsNoData(false);
			}
			setIsErrorCallAPI(false);
		} else {
			setIsErrorCallAPI(true);
			setResultSearch([]);
		}
		setFooterIndicator(false);
		setRefreshData(false);
	}

	/**
	 * event click choose TradingProduct item in list
	 * @param number TradingProductIdid selected
	 */
	const handleClickSelectTradingProductItem = (TradingProduct: TradingProductSuggest) => {
		props.selectedData(TradingProduct, props.typeSearch);
		if (!props.isRelation) {
			callAPISuggestionsChoice(TradingProduct);
		}
	}

	/**
	 * save suggestions choice
	 * @param itemSelected 
	 */
	const callAPISuggestionsChoice = (selected: TradingProductSuggest) => {
		saveTradingProductSuggestionsChoice({
			sugggestionsChoice: [
				{
					index: INDEX_CHOICE,
					idResult: selected.productTradingId
				}
			]
		});
	}

	/**
	 * Get modal flex
	 */
	const getFlexNumber = () => {
		if (resultSearch.length === 0) {
			return 1;
		} else if (y < 0) {
			return 10;
		} else {
			return 2;
		}
	}

	/**
	 * Render ActivityIndicator
	 * @param animating 
	 */
	const renderActivityIndicator = (animating: boolean) => {
		if (!animating) return null;
		return (
			<ActivityIndicator style={{ padding: 5 }} animating={animating} size="large" />
		)
	}

	/**
	 * Render separator flatlist
	 */
	const renderItemSeparator = () => {
		return (
			<View
				style={TradingProductSuggestSearchStyles.itemSeparatorStyle}
			/>
		)
	}

	return (
		<View style={TradingProductSuggestSearchStyles.modalContent}>
			<Animated.View
				style={[TradingProductSuggestSearchStyles.colorStyle, { flex: resultSearch.length > 0 ? 1 : 4, justifyContent: 'flex-end' }]}
				{...panResponder.panHandlers}
			>
				<TouchableOpacity
					style={TradingProductSuggestSearchStyles.modalTouchable}
					onPress={() => props.closeModal()}
				>
					<View>
						<Icon style={TradingProductSuggestSearchStyles.modalIcon} name="iconModal" />
					</View>
				</TouchableOpacity>
			</Animated.View>
			<View style={[TradingProductSuggestSearchStyles.colorStyle, { flex: getFlexNumber() }]}>
				<View style={TradingProductSuggestSearchStyles.inputContainer}>
					<View style={TradingProductSuggestSearchStyles.inputContent}>
						<TextInput style={TradingProductSuggestSearchStyles.inputSearchTextData} placeholder=
							{props.typeSearch == TypeSelectSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
								: props.fieldLabel + translate(messages.placeholderMultiChoose)}
							value={searchValue}
							onChangeText={(text) => setSearchValue(text)}
						/>
						<View style={TradingProductSuggestSearchStyles.textSearchContainer}>
							<TouchableOpacity
								onPress={() => {
									props.closeModal();
									props.openDetailSearchModal();
								}}
							>
								<Icon name="searchOption" />
							</TouchableOpacity>
						</View>
					</View>
					<TouchableOpacity
						style={TradingProductSuggestSearchStyles.cancel}
						onPress={() => {
							if (!_.isEmpty(searchValue)) {
								setRefreshData(true);
							}
							setSearchValue(TEXT_EMPTY);
						}}
					>
						<Text style={TradingProductSuggestSearchStyles.cancelText}>{translate(messages.cancelText)}</Text>
					</TouchableOpacity>
				</View>
				<View style={TradingProductSuggestSearchStyles.dividerContainer} />
				{
					isErrorCallAPI && (
						<Text style={TradingProductSuggestSearchStyles.errorMessage}>{translate(messages.errorCallAPI)}</Text>
					)
				}
				{!isErrorCallAPI &&
					<View style={[resultSearch.length > 0 ? TradingProductSuggestSearchStyles.suggestionContainer : TradingProductSuggestSearchStyles.suggestionContainerNoData]}>
						<FlatList
							data={resultSearch}
							keyExtractor={item => item.productTradingId.toString()}
							onEndReached={() => {
								if (!isNoData) {
									setFooterIndicator(true);
									handleSearch(searchValue, offset + LIMIT);
								}
							}}
							onEndReachedThreshold={0.1}
							ListFooterComponent={renderActivityIndicator(footerIndicator)}
							ItemSeparatorComponent={renderItemSeparator}
							refreshControl={
								<RefreshControl
									refreshing={refreshData}
									onRefresh={() => {
										setFooterIndicator(true);
										setRefreshData(true);
										handleSearch(searchValue, 0);
										setTimeout(() => {
											setRefreshData(false);
										}, 3000);
									}}
								/>
							}
							renderItem={({ item }) =>
								<View>
									<TouchableOpacity style={resultSearch.length > 0 ? TradingProductSuggestSearchStyles.touchableSelect : TradingProductSuggestSearchStyles.touchableSelectNoData}
										onPress={() => {
											handleClickSelectTradingProductItem(item);
											props.closeModal();
										}}>
										<View style={TradingProductSuggestSearchStyles.dataViewStyle}>
											<Text style={TradingProductSuggestSearchStyles.suggestText}>{item.customerName}</Text>
											<Text style={TradingProductSuggestSearchStyles.suggestProductNameText}>{`${item.productName} (${StringUtils.getFieldLabel(item, 'progressName', authorizationState.languageCode)})`}</Text>
											<Text style={TradingProductSuggestSearchStyles.suggestText}>{item.employeeName}</Text>
										</View>
									</TouchableOpacity>
								</View>
							}
						/>
					</View>}
			</View>
		</View>
	)
}