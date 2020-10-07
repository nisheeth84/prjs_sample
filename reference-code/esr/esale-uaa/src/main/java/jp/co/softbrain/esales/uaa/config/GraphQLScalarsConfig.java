package jp.co.softbrain.esales.uaa.config;

import java.io.IOException;
import java.time.DateTimeException;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.function.Function;

import javax.servlet.http.Part;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.coxautodev.graphql.tools.SchemaParserOptions;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import graphql.language.StringValue;
import graphql.schema.Coercing;
import graphql.schema.CoercingParseLiteralException;
import graphql.schema.CoercingParseValueException;
import graphql.schema.CoercingSerializeException;
import graphql.schema.GraphQLScalarType;
import graphql.servlet.core.ApolloScalars;

/**
 * Configuration of GraphQL Scalars
 */
@Configuration
public class GraphQLScalarsConfig {

	/**
	 * create Bean objectMapper
	 *
	 * @return
	 */
	@Bean
	public ObjectMapper objectMapper() {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		SimpleModule module = new SimpleModule();
		module.addDeserializer(Part.class, new PartDeserializer());
		objectMapper.registerModule(module);
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
		return objectMapper;
	}

	/**
	 * create Bean schemaParserOptions
	 *
	 * @return SchemaParserOptions
	 */
	@Bean
	public SchemaParserOptions schemaParserOptions() {
		return SchemaParserOptions.newOptions().objectMapperProvider(fieldDefinition -> objectMapper()).build();
	}

	/**
	 * create Bean dateTimeType
	 *
	 * @return GraphQLScalarType
	 */
	@Bean
	public GraphQLScalarType dateTimeType() {
		return GraphQLScalarType.newScalar().name("DateTime").coercing(new Coercing<OffsetDateTime, String>() {

			/**
			 * @see graphql.schema.Coercing
			 */
			@Override
			public String serialize(Object input) {
				OffsetDateTime offsetDateTime;
				if (input instanceof OffsetDateTime) {
					offsetDateTime = (OffsetDateTime) input;
				} else if (input instanceof ZonedDateTime) {
					offsetDateTime = ((ZonedDateTime) input).toOffsetDateTime();
				} else if (input instanceof Instant) {
					offsetDateTime = ((Instant) input).atOffset(ZoneOffset.UTC);
				} else if (input instanceof String) {
					offsetDateTime = parseOffsetDateTime(input.toString(), CoercingSerializeException::new);
				} else {
					throw new CoercingSerializeException(
							"Expected something we can convert to 'java.time.OffsetDateTime' but was '"
									+ typeName(input) + "'.");
				}
				try {
					return DateTimeFormatter.ISO_OFFSET_DATE_TIME.format(offsetDateTime);
				} catch (DateTimeException e) {
					throw new CoercingSerializeException(
							"Unable to turn TemporalAccessor into OffsetDateTime because of : '" + e.getMessage()
									+ "'.");
				}
			}

			/**
			 * @see graphql.schema.Coercing
			 */
			@Override
			public OffsetDateTime parseValue(Object input) {
				OffsetDateTime offsetDateTime;
				if (input instanceof OffsetDateTime) {
					offsetDateTime = (OffsetDateTime) input;
				} else if (input instanceof ZonedDateTime) {
					offsetDateTime = ((ZonedDateTime) input).toOffsetDateTime();
				} else if (input instanceof Instant) {
					offsetDateTime = ((Instant) input).atOffset(ZoneOffset.UTC);
				} else if (input instanceof String) {
					offsetDateTime = parseOffsetDateTime(input.toString(), CoercingParseValueException::new);
				} else {
					throw new CoercingParseValueException("Expected a 'String' but was '" + typeName(input) + "'.");
				}
				return offsetDateTime;
			}

			/**
			 * @see graphql.schema.Coercing
			 */
			@Override
			public OffsetDateTime parseLiteral(Object input) {
				if (!(input instanceof StringValue)) {
					throw new CoercingParseLiteralException(
							"Expected AST type 'StringValue' but was '" + typeName(input) + "'.");
				}
				return parseOffsetDateTime(((StringValue) input).getValue(), CoercingParseLiteralException::new);
			}

			/**
			 * parse OffsetDateTime from value input [s]
			 */
			private OffsetDateTime parseOffsetDateTime(String s, Function<String, RuntimeException> exceptionMaker) {
				try {
					return OffsetDateTime.parse(s, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
				} catch (DateTimeParseException e) {
					throw exceptionMaker
							.apply("Invalid RFC3339 value : '" + s + "'. because of : '" + e.getMessage() + "'");
				}
			}
		}).build();
	}

	/**
	 * get type name
	 *
	 * @param input
	 * @return
	 */
	public static String typeName(Object input) {
		if (input == null) {
			return "null";
		}
		return input.getClass().getSimpleName();
	}

	@Bean
	public GraphQLScalarType uploadScalarDefine() {
		return ApolloScalars.Upload;
	}

	public class PartDeserializer extends JsonDeserializer<Part> {
		@Override
		public Part deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
			return null;
		}
	}
}
